import { Categoria } from '../models/index.js';

export async function criarCategoria
(req, res) {
  try {
    const { nome, descricao } = req.body;
    const categoria = await Categoria.create({ nome, descricao });
    return res.status(201).json(categoria);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar categoria.' });
  }
}

export async function listarCategoria(req, res) {
  try {
    const categoria= await Categoria.findAll();
    return res.status(200).json(categoria);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao listar categorias.' });
  }
}

export async function atualizarCategoria(req, res) {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    const [atualizado] = await Categoria.update({ nome, descricao }, { where: { id_categoria: id } });
    return atualizado ? res.status(200).json({ message: 'Categoria atualizado.' }) : res.status(404).json({ message: 'Categoria não encontrado.' });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao atualizar categoria.' });
  }
}

export async function deletarCategoria(req, res) {
  try {
    const { id } = req.params;
    const deletado = await Tema.destroy({ where: { id_categoria: id } });
    return deletado ? res.status(200).json({ message: 'Categoria excluído.' }) : res.status(404).json({ message: 'Categoria não encontrado.' });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao excluir categoria.' });
  }
}
