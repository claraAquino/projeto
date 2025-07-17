
import requests
from docx import Document
import psycopg2
import json
import os

# Configurações do banco
DB_CONFIG = {
    "host": "localhost",
    "dbname": "postgres",
    "user": "postgres",
    "password": "postgres",
    "port": "5432"
}


URL_DOCX = "https://docs.google.com/document/d/1XvSzH2wrTJmV-V1Yfz6izRQKg7tlKUkt/export?format=docx"

ID_DOCUMENTO = 27  
ID_SUBCATEGORIA = 16


EMBEDDING_API_URL = "http://localhost:3000/api/embeddings"


TEMP_DOCX_PATH = "temp_documento.docx"

def baixar_documento(url, caminho_local):
    print("Baixando documento...")
    r = requests.get(url)
    r.raise_for_status()
    with open(caminho_local, "wb") as f:
        f.write(r.content)
    print("Download concluído.")

def extrair_paragrafos(caminho_docx):
    print("Extraindo parágrafos do documento...")
    doc = Document(caminho_docx)
    paragrafos = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    print(f"{len(paragrafos)} parágrafos extraídos.")
    return paragrafos

def gerar_embedding(texto):
    try:
        resp = requests.post(EMBEDDING_API_URL, json={
            "model": "nomic-embed-text",
            "prompt": texto
        })
        resp.raise_for_status()
        return resp.json()["embedding"]
    except Exception as e:
        print(f"Erro ao gerar embedding: {e}")
        return None

def conectar_pg():
    return psycopg2.connect(
        host=DB_CONFIG["host"],
        dbname=DB_CONFIG["dbname"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        port=DB_CONFIG["port"]
    )

def salvar_paragrafo(id_documento, texto, embedding):
    conn = None
    cur = None
    try:
        conn = conectar_pg()
        cur = conn.cursor()

        # Checa se parágrafo já existe para evitar duplicidade
        cur.execute("""
            SELECT COUNT(*) FROM queroquero.documento_paragrafo_embedding
            WHERE id_documento = %s AND texto = %s
        """, (id_documento, texto))
        (count,) = cur.fetchone()
        if count > 0:
            print("Parágrafo já existe no banco, pulando...")
            return

        
        cur.execute("""
            INSERT INTO queroquero.documento_paragrafo_embedding (id_documento, texto, embedding)
            VALUES (%s, %s, %s)
        """, (id_documento, texto, json.dumps(embedding)))

        conn.commit()
        print("Parágrafo inserido com sucesso.")
    except Exception as e:
        print(f"Erro ao salvar parágrafo: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

def main():
    try:
        baixar_documento(URL_DOCX, TEMP_DOCX_PATH)
        paragrafos = extrair_paragrafos(TEMP_DOCX_PATH)
        for par in paragrafos:
            emb = gerar_embedding(par)
            if emb:
                salvar_paragrafo(ID_DOCUMENTO, par, emb)
            else:
                print("Embedding não gerado para o parágrafo, pulando...")
    finally:
        if os.path.exists(TEMP_DOCX_PATH):
            os.remove(TEMP_DOCX_PATH)
        print("Processo finalizado.")

if __name__ == "__main__":
    main()
