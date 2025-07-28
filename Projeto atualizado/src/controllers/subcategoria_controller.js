
import { Subcategoria, Categoria } from '../models/index.js';

export async function criarSubcategoria(req, res) {
  try {
    const { nome, descricao, id_categoria } = req.body;
    const subcategoria = await Subcategoria.create({ nome, descricao, id_categoria });
    return res.status(201).json(subcategoria);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao criar subcategoria.' });
  }
}

export async function listarSubcategoria(req, res) {
  try {
    const subcategoria = await Subcategoria.findAll({ include: Categoria });
    return res.status(200).json(subcategoria);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao listar subcategorias.' });
  }
}

export async function atualizarSubcategoria(req, res) {
  try {
    const { id } = req.params;
    const { nome, descricao, id_categoria } = req.body;
    const [atualizado] = await Subcategoria.update({ nome, descricao, id_categoria }, { where: { id_subcategoria: id } });
    return atualizado ? res.status(200).json({ message: 'Subcategoria atualizado.' }) : res.status(404).json({ message: 'Subcategoria não encontrada.' });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao atualizar subcategoria.' });
  }
}

export async function deletarSubcategoria(req, res) {
  try {
    const { id } = req.params;
    const deletado = await Subcategoria.destroy({ where: { id_subcategoria: id } });
    return deletado ? res.status(200).json({ message: 'Subcategoria excluído.' }) : res.status(404).json({ message: 'Subcategoria não encontrada.' });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao excluir subcategoria' });
  }
}
