import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { model, pergunta, contexto } = req.body;

    const payload = {
      model: model || "llama3",
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em responder com base em documentos fornecidos pela empresa Quero-Quero."
        },
        {
          role: "user",
          content: `Baseado no seguinte texto:\n${contexto}\n\nResponda a esta pergunta:\n${pergunta}`
        }
      ]
    };

    const response = await axios.post('http://localhost:11434/chat', payload);
    const resposta = response.data?.message?.content?.trim();

    if (!resposta) {
      return res.status(500).json({ erro: "Resposta vazia retornada pelo Ollama." });
    }

    res.json({ resposta });

  } catch (error) {
    console.error('Erro ao gerar resposta com Ollama:', error.message);
    res.status(500).json({ erro: 'Erro ao gerar resposta com Ollama' });
  }
});

export default router;
