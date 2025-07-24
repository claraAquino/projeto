from fastapi import APIRouter, HTTPException
from python_backend.models import DocumentoEntrada
from ..database import conectar_pg
from ..utils import gerar_embedding
from docx import Document
import requests, json, os

router = APIRouter()
@router.post("/documento")
def processar_documento(dados: DocumentoEntrada):
    try:
        conn = conectar_pg()
        cursor = conn.cursor()

        response = requests.get(dados.url)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Erro ao baixar arquivo.")

        path = f"./temp_{dados.id_documento}.docx"
        with open(path, "wb") as f:
            f.write(response.content)

        doc = Document(path)
        paragrafos = [p.text.strip() for p in doc.paragraphs if len(p.text.strip()) > 20]

        inseridos = 0
        print(f"Parágrafos extraídos: {len(paragrafos)}")

        for p in paragrafos:
            embedding = gerar_embedding(p)

            cursor.execute("""
                SELECT COUNT(*) FROM queroquero.documento_paragrafo_embedding
                WHERE id_documento = %s AND texto = %s
            """, (dados.id_documento, p))

            resultado = cursor.fetchone()
            quantidade = resultado[0] if resultado else 0

            if quantidade == 0:
                cursor.execute("""
                    INSERT INTO queroquero.documento_paragrafo_embedding (id_documento, texto, embedding)
                    VALUES (%s, %s, %s)
                """, (dados.id_documento, p, json.dumps(embedding)))
                inseridos += 1

        conn.commit()
        cursor.close()
        conn.close()
        os.remove(path)

        return {"mensagem": "Documento processado", "paragrafos_inseridos": inseridos}

    except Exception as e:
        # Tente também logar no console e retornar o erro para facilitar o debug
        print(f"Erro no processamento do documento: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {e}")
