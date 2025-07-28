import os



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from python_backend.routes import documentos, consultas

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(documentos.router, prefix="/embeddings")
app.include_router(consultas.router)


