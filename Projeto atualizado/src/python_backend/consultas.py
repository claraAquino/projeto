from fastapi import APIRouter, HTTPException
from ..models import PerguntaEntrada
from ..database import conectar_pg
from ..utils import gerar_embedding, cosine_similarity, chamar_ia

router = APIRouter()

@router.post("/responder")
def responder_pergunta(dados: PerguntaEntrada):
    conn = conectar_pg()
    cursor = conn.cursor()

    emb_pergunta = gerar_embedding(dados.pergunta)

    cursor.execute("""
        SELECT d.titulo, d.url, e.texto, e.embedding
        FROM queroquero.documento d
        JOIN queroquero.documento_paragrafo_embedding e ON d.id = e.id_documento
        WHERE d.id_subcategoria = %s
    """, (dados.id_subcategoria,))
    resultados = cursor.fetchall()

    melhor_score = -1
    melhor_paragrafo = ""
    melhor_url = ""

    for titulo, url, texto, emb in resultados:
        score = cosine_similarity(emb_pergunta, emb)
        if score > melhor_score:
            melhor_score = score
            melhor_paragrafo = texto
            melhor_url = url

    if melhor_score < 0.85:
        return {"mensagem": "Nenhum parágrafo relevante encontrado."}

    resposta_final = chamar_ia(dados.pergunta, melhor_paragrafo)

    return {
        "resposta": resposta_final,
        "paragrafo": melhor_paragrafo,
        "similaridade": round(melhor_score, 4),
        "documento_url": melhor_url
    }
