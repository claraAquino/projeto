from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2
import numpy as np
import json
import os
import requests
from fastapi.middleware.cors import CORSMiddleware
import time
import traceback


CACHE_FILE = "cache_respostas.json"
SIMILARITY_THRESHOLD = 0.85

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"]
)

def conectar_pg():
    return psycopg2.connect(
        host="localhost",
        dbname="postgres",
        user="postgres",
        password="postgres",
        port="5432"
    )


class PerguntaInput(BaseModel):
    id_subcategoria: int
    pergunta: str

class TextoInput(BaseModel):
    texto: str


def chamar_embedding(texto: str):
    url = "http://localhost:3000/api/embeddings"
    for tentativa in range(3):
        try:
            response = requests.post("http://localhost:3000/api/embeddings", json={"model": "nomic-embed-text","prompt": texto})
            if response.status_code == 200:
                embedding = response.json().get("embedding")
                if embedding:
                    return embedding
                else:
                    print(f"Embedding não encontrado na resposta: {response.json()}")
            else:
                print(f"Erro ao chamar embedding (status {response.status_code}): {response.text}")
        except requests.RequestException as e:
            print(f"Exceção na tentativa {tentativa+1} de chamar embedding: {e}")
        time.sleep(1)
    raise Exception("Erro ao chamar backend embeddings após 3 tentativas")

@app.post("/gerar-embedding")
def gerar_embedding(input_texto: TextoInput):
    try:
        embedding = chamar_embedding(input_texto.texto)
        return {"embedding": embedding}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar embedding: {e}")


def cosine_similarity(a, b):
    a, b = np.array(a), np.array(b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))

def carregar_cache():
    try:
        if os.path.exists(CACHE_FILE):
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        else:
            return {}
    except (json.JSONDecodeError, IOError) as e:
        print(f"Erro ao carregar cache: {e}")
        return {}


def chamar_ollama_gerar_resposta(pergunta: str, contexto: str) -> str:
    prompt = f"""
Baseado no seguinte texto:
{contexto}

Responda a esta pergunta:
{pergunta}
"""

    payload = {
        "model": "stablelm-zephyr",  
        "prompt": prompt,
        "max_tokens": 150,
        "temperature": 0.2
    }

    try:
        resp = requests.post("http://localhost:11434/api/generate", json=payload, stream=True)
        resp.raise_for_status()

        resposta = ""
        for linha in resp.iter_lines():
            if linha:
                try:
                    parte = json.loads(linha.decode("utf-8"))
                    resposta += parte.get("response") or parte.get("text") or ""
                except Exception as e:
                    print(f"Erro ao decodificar linha da resposta do Ollama: {e}")

        return resposta.strip() if resposta else "Desculpe, não foi possível gerar a resposta no momento."

    except Exception as e:
        print(f"Erro ao chamar Ollama para gerar resposta: {e}")
        return "Desculpe, não foi possível gerar a resposta no momento."



@app.post("/busca-similaridade")
def buscar_similaridade(input: PerguntaInput):
    id_subcategoria = input.id_subcategoria
    pergunta = input.pergunta.strip().lower()
    chave_cache = f"{id_subcategoria}|{pergunta}"

    try:
        
        cache = carregar_cache()

        if chave_cache in cache:
            print(f"Resposta encontrada no cache para chave: {chave_cache}")
            return {"fonte": "cache", **cache[chave_cache]}

        
        emb_pergunta = chamar_embedding(pergunta)

        
        conn = conectar_pg()
        cur = conn.cursor()
        cur.execute("""
            SELECT d.titulo, d.arquivo, e.texto, e.embedding
            FROM queroquero.documento_paragrafo_embedding e
            JOIN queroquero.documento d ON d.id_documento = e.id_documento
            WHERE d.id_subcategoria = %s
        """, (id_subcategoria,))
        resultados = cur.fetchall()
        cur.close()
        conn.close()

        
        melhor = {"score": -1, "texto": "", "url": "", "titulo": ""}

        for titulo, url, paragrafo, emb_json in resultados:
            try:
                emb = json.loads(emb_json) if isinstance(emb_json, str) else emb_json
                score = cosine_similarity(emb_pergunta, emb)
                if score > melhor["score"]:
                    melhor.update({
                        "score": score,
                        "texto": paragrafo,
                        "url": url,
                        "titulo": titulo
                    })
            except Exception as e:
                print(f"Erro ao processar embedding no banco: {e}")
                continue

        if melhor["score"] >= SIMILARITY_THRESHOLD:
            
            resposta_gerada = chamar_ollama_gerar_resposta(pergunta, melhor["texto"])

            resultado = {
                "fonte": "busca",
                "paragrafo": resposta_gerada,
                "url": melhor["url"],
                "titulo": melhor["titulo"],
                "score": melhor["score"]
            }

            
            cache[chave_cache] = resultado
            with open(CACHE_FILE, "w", encoding="utf-8") as f:
                json.dump(cache, f, indent=2, ensure_ascii=False)

            return resultado
        else:
            return {"mensagem": "Nenhuma resposta suficientemente relevante encontrada."}

    except Exception as e:
        print("Erro na busca_similaridade:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erro interno: {e}")


@app.get("/health")
def health_check():
    return {"status": "ok"}
