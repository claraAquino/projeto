import { Feedback } from '../models/index.js';

export async function criarFeedback(req, res) {
  try {
    const { id_consulta, satisfatorio, comentario } = req.body;

    if (!id_consulta || satisfatorio === undefined) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios ausentes.' });
    }

    const novoFeedback = await Feedback.create({
      id_consulta,
      satisfatorio,
      comentario,
    });

    res.status(201).json(novoFeedback);
  } catch (erro) {
    console.error('Erro ao criar feedback:', erro);
    res.status(500).json({ erro: 'Erro interno ao salvar feedback.' });
  }
}
