
import { Sugestao, Documento, Consulta } from '../models/index.js';
import axios from 'axios'; 

export async function gerarSugestaoIA(req, res) {
  try {
    const { id_consulta } = req.params;

    const consulta = await Consulta.findByPk(id_consulta);
    if (!consulta) return res.status(404).json({ mensagem: "Consulta não encontrada." });

    const respostaIA = await axios.post('http://localhost:8000/busca-similaridade', {
      input: consulta.input
    });

    const resultados = respostaIA.data.resultados || [];

    const sugestoesSalvas = await Promise.all(resultados.map(async resultado => {
      return await Sugestao.create({
        id_consulta,
        id_documento: resultado.id_documento,
        solucao: resultado.texto,
        data_sugestao: new Date()
      });
    }));

    res.status(200).json(sugestoesSalvas);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao gerar sugestão", detalhes: err.message });
  }
}

export async function buscarSugestoesPorConsulta(req, res) {
  try {
    const { id_consulta } = req.params;

    const sugestoes = await Sugestao.findAll({
      where: { id_consulta },
      include: [{ model: Documento }]
    });

    res.status(200).json(sugestoes);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar sugestões", detalhes: err.message });
