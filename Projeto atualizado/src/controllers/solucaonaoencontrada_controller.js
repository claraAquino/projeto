import { Solucaonaoencontrada } from '../models/index.js';import { dataHoraLocal } from '../utils/data.js';

export async function registrarSolucaoNaoEncontrada(req, res) {
  try {
    const { id_consulta, statusdoc } = req.body;

    const registro = await Solucaonaoencontrada.create({
      id_consulta,
      statusdoc,
      data_criacao: dataHoraLocal()
    });

    return res.status(201).json(registro);
  } catch (erro) {
    console.error("Erro ao registrar ausência de solução:", erro);
    return res.status(500).json({ mensagem: "Erro ao registrar ausência de solução" });
  }
}

