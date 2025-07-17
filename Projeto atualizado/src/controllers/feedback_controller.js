import { Feedback } from '../models/index.js';
import { dataHoraLocal } from '../utils/data.js';

export async function registrarFeedback(req, res) {
  try {
    const { id_consulta, util } = req.body;

    const feedback = await Feedback.create({
      id_consulta,
      util,
      data_feedback: dataHoraLocal()
    });

    return res.status(201).json(feedback);
  } catch (erro) {
    console.error("Erro ao registrar feedback:", erro);
    return res.status(500).json({ mensagem: "Erro ao registrar feedback" });
  }
}
