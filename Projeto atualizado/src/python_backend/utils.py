import requests
import numpy as np
import json
import os
import psycopg2

GROQ_API_KEY = ""

EMBEDDING_API_URL = "http://localhost:11434/api/embeddings"
SIMILARITY_THRESHOLD = 0.85
CACHE_FILE = "cache_respostas.json"

def gerar_embedding(texto):
    resp = requests.post(EMBEDDING_API_URL, json={"model": "nomic-embed-text", "prompt": texto})
    resp.raise_for_status()
    return resp.json()["embedding"]

def cosine_similarity(a, b):
    a, b = np.array(a), np.array(b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))

def chamar_ia(pergunta, contexto):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    messages = [
        {
            "role": "system",
            "content": (
                "Você é um assistente útil que trabalhará para a empresa Quero-Quero auxiliando nas repostas de acordo com as infromações fornecidas, respostas essas sendo curtas e objetivas. "
                "Se o contexto não contiver a resposta, informe educadamente que não tem essa informação."
            )
        },
        {
            "role": "user",
            "content": f"Contexto:\n{contexto}\n\nPergunta: {pergunta}\n\nPor favor, responda de forma clara e objetiva."
        }
    ]

    payload = {
        "model": "llama-3.1-8b-instant",  
        "messages": messages,
        "max_tokens": 100,
        "temperature": 0.35
    }

    resp = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
    resp.raise_for_status()
    resposta = resp.json()

    

    return resposta["choices"][0]["message"]["content"].strip()
