import { SolucaoNaoEncontrada, Consulta, Categoria, Subcategoria } from '../models/index.js';

export const listarSolucoesNaoEncontradas = async (req, res) => {
  try {
   const resultados = await SolucaoNaoEncontrada.findAll({
      include: [
        {
          model: Consulta,
          attributes: ['input', 'data_consulta']
        }
      ],
      order: [['data_criacao', 'DESC']]
    });

    res.json(resultados);
  } catch (error) {
    console.error('[ERRO] Listar soluções não encontradas:', error);
    res.status(500).json({ erro: 'Erro ao buscar soluções não encontradas' });
  }
};
