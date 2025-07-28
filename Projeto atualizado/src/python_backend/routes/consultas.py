from fastapi import APIRouter, HTTPException, Request
from ..models import PerguntaEntrada
from ..database import conectar_pg
from ..utils import gerar_embedding, cosine_similarity, chamar_ia

import os
import json

router = APIRouter()

from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent  # Ajuste conforme necessário
CACHE_FILE = BASE_DIR / "cache_respostas.json"

SIMILARIDADE_MINIMA = 0.65

@router.post("/responder")
def responder_pergunta(dados: PerguntaEntrada):
    pergunta = dados.pergunta.strip()
    id_subcategoria = dados.id_subcategoria

    if not pergunta or not id_subcategoria:
        raise HTTPException(status_code=400, detail="Pergunta e subcategoria são obrigatórias.")

    chave_cache = pergunta.lower()
    cache = {}

    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            try:
                cache = json.load(f)
            except json.JSONDecodeError:
                cache = {}

    if chave_cache in cache:
        resposta_cache = cache[chave_cache]
        return {
            "resposta": resposta_cache["resposta"],
            "paragrafo": resposta_cache["paragrafo"],
            "documento_url": resposta_cache["url"],
            "similaridade": round(resposta_cache["score"], 4),
            "fonte": "cache"
        }

    try:
        emb_pergunta = gerar_embedding(pergunta)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar embedding: {str(e)}")

    try:
        conn = conectar_pg()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                e.id_documento,
                e.texto,
                e.embedding,
                d.arquivo
            FROM queroquero.documento_paragrafo_embedding e
            JOIN queroquero.documento d ON d.id_documento = e.id_documento
            WHERE d.id_subcategoria = %s
        """, (id_subcategoria,))
        resultados = cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao consultar banco: {str(e)}")

    melhor_score = -1
    melhor_paragrafo = ""
    melhor_url = ""

    for id_documento, texto, emb_db, arquivo in resultados:
        try:
            emb_doc = json.loads(emb_db) if isinstance(emb_db, str) else emb_db
            score = cosine_similarity(emb_pergunta, emb_doc)
            if score > melhor_score:
                melhor_score = score
                melhor_paragrafo = texto
                melhor_url = arquivo
        except Exception:
            continue

    if melhor_score < SIMILARIDADE_MINIMA:
        try:
            cursor.execute("""
                INSERT INTO queroquero.solucaonaoencontrada (data_criacao, id_consulta, input, statusdoc)
                VALUES (NOW(), %s, %s, %s)
            """, (dados.id_consulta, pergunta, "pendente"))

            conn.commit()
        except Exception as e:
            print(f"[WARN] Falha ao registrar solucao_nao_encontrada: {e}")
            conn.rollback()

        return {
            "mensagem": "Nenhum parágrafo suficientemente relevante encontrado.",
            "score_maximo": round(melhor_score, 4),
            "fonte": "nenhuma"
        }

    # === Chamar IA para resposta final ===
    try:
        resposta_ia = chamar_ia(pergunta, melhor_paragrafo)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao chamar IA: {str(e)}")
    cache[pergunta.lower()] = {
    "resposta": resposta_ia,
    "paragrafo": melhor_paragrafo,
    "url": melhor_url,
    "score": melhor_score
    }

    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, indent=2, ensure_ascii=False)

    return {
        "resposta": resposta_ia,
        "paragrafo": melhor_paragrafo,
        "documento_url": melhor_url,
        "similaridade": round(melhor_score, 4),
        "fonte": "base"
    }
