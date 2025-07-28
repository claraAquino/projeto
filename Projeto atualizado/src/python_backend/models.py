from pydantic import BaseModel
from typing import Optional

class DocumentoEntrada(BaseModel):
    id_documento: int
    url: str

class PerguntaEntrada(BaseModel):
    pergunta: str
    id_subcategoria: int
    id_consulta: Optional[int] = None
