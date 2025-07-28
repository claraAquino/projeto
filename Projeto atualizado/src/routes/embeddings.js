import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { model, prompt } = req.body;

    if (!model || !prompt) {
      return res.status(400).json({ error: 'Model e prompt são obrigatórios.' });
    }

    const response = await axios.post('http://localhost:11434/api/embeddings', {
      model,
      prompt
    });

    if (!response.data || !response.data.embedding) {
      return res.status(500).json({ error: 'Resposta do modelo não contém embedding.' });
    }

    res.json({ embedding: response.data.embedding });

  } catch (error) {
    console.error('Erro ao gerar embedding:', error.message);
    res.status(500).json({ error: 'Erro ao gerar embedding' });
  }
});

export default router;
