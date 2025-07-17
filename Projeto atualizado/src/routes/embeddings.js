import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { model, prompt } = req.body;

    const response = await axios.post('http://localhost:11434/api/embeddings', {

      model,
      prompt
    });

    res.json({ embedding: response.data.embedding });

  } catch (error) {
    console.error('Erro ao gerar embedding:', error.message);
    res.status(500).json({ error: 'Erro ao gerar embedding' });
  }
});


export default router;
