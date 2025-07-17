
import { Consulta, Sessao } from '../models/index.js';

export async function criarConsulta(req, res) {
  try {
    const { input } = req.body;
    const id_sessao = req.user?.id_sessao; // ID da sessão autenticada (extraído do token)

    if (!input) return res.status(400).json({ mensagem: "Input é obrigatório." });

    const novaConsulta = await Consulta.create({
      input,
      id_sessao,
      data_consulta: new Date()
    });

    res.status(201).json(novaConsulta);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar consulta", detalhes: err.message });
  }
}

import { Documento, DocumentoEmbedding, Subcategoria } from '../models/index.js';
import openai from 'openai';
import { Sequelize } from 'sequelize';



export async function responderPergunta(req, res) {
  try {
    const { pergunta, id_subcategoria } = req.body;

    if (!pergunta || !id_subcategoria) {
      return res.status(400).json({ erro: 'Pergunta ou subcategoria não informada.' });
    }

    // Gerar embedding da pergunta
    const perguntaEmbedding = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: pergunta,
    });

    const embPergunta = perguntaEmbedding.data[0].embedding;

    // Buscar documentos e embeddings da subcategoria
    const docs = await Documento.findAll({
      where: { id_subcategoria },
      include: [{ model: DocumentoEmbedding, as: 'embedding' }],
    });

    let melhorScore = -1;
    let melhorTexto = '';
    let melhorUrl = '';

    for (const doc of docs) {
      const texto = doc.embedding.texto_concatenado;
      const url = doc.url_arquivo;

      const paragrafos = texto.split('\n').filter(p => p.length > 20);

      for (const par of paragrafos) {
        const embPar = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: par,
        });

        const embVec = embPar.data[0].embedding;

        const score = cosineSimilarity(embPergunta, embVec);

        if (score > melhorScore) {
          melhorScore = score;
          melhorTexto = par;
          melhorUrl = url;
        }
      }
    }

    if (melhorScore >= 0.85) {
      return res.json({
        texto: melhorTexto,
        url: melhorUrl,
        similaridade: melhorScore,
      });
    } else {
      return res.status(200).json({ mensagem: 'Nenhuma resposta suficientemente relevante encontrada.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar resposta.' });
  }
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((acc, val, i) => acc + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
  return dot / (normA * normB);
}

