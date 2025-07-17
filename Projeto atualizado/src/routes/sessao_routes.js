import express from 'express';
import { Sessao } from '../models/index.js'; 
import { dataHoraLocal } from '../utils/data.js';

const router = express.Router();

router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'Token não fornecido.' });

    const sessao = await Sessao.findOne({
      where: {
        token,
        data_hora_logout: null
      }
    });

    if (!sessao) {
      return res.status(400).json({ message: 'Sessão já encerrada ou inválida.' });
    }

    sessao.data_hora_logout = new dataHoraLocal(); // ou dataHoraLocal() se já estiver funcionando
    await sessao.save();

    res.json({ message: 'Logout efetuado com sucesso.' });
  } catch (err) {
    console.error('Erro no logout:', err);
    res.status(500).json({ message: 'Erro ao efetuar logout.' });
  }
});

export default router;
