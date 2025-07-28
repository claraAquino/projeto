import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { model = 'mistral-saba-24b', pergunta, contexto } = req.body;

    if (!pergunta || !contexto) {
      return res.status(400).json({ erro: 'Parâmetros "pergunta" e "contexto" são obrigatórios.' });
    }

    
    const prompt = `
Você é um assistente especializado em fornecer respostas claras, objetivas e precisas com base no texto fornecido.
Leia atentamente o contexto abaixo e responda à pergunta de forma completa e educada.

Contexto:
${contexto}

Pergunta:
${pergunta}

Instruções:
- Utilize somente as informações presentes no contexto.
- Se a resposta não estiver no contexto, informe educadamente que não sabe ou que não há informação suficiente.
- Evite respostas genéricas ou vagas.
- Seja claro e direto, fornecendo detalhes relevantes.
- Não invente informações.

Resposta:
`;

    // Payload para a API Groq
    const payload = {
      model,
      prompt,
      max_tokens: 250,
      temperature: 0.3,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\n\n"]
    };

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    const response = await axios.post(
      'https://api.groq.ai/v1/generate',
      payload,
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 8000,
      }
    );

    const resposta = response.data?.text?.trim();

    if (!resposta) {
      return res.status(500).json({ erro: 'Resposta vazia retornada pela API Groq.' });
    }

    return res.json({ resposta });

  } catch (error) {
    console.error('Erro ao gerar resposta com Groq:', error.response?.data || error.message);
    return res.status(500).json({ erro: 'Erro ao gerar resposta com Groq' });
  }
});

export default router;
