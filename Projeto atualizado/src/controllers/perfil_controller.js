import { Perfil } from '../models/perfil_model.js';

// Criar novo perfil
export async function createPerfil(req, res) {
  try {
    const { nome, tipo } = req.body;

    if (!nome) {
      return res.status(400).json({ message: 'O campo "nome" é obrigatório.' });
    }

    const existe = await Perfil.findOne({ where: { nome } });
    if (existe) {
      return res.status(409).json({ message: 'Já existe um perfil com esse nome.' });
    }

    const novoPerfil = await Perfil.create({ nome, tipo });

    return res.status(201).json({
      id_perfil: novoPerfil.id_perfil,
      nome: novoPerfil.nome,
      tipo: novoPerfil.tipo
    });
  } catch (err) {
    console.error('Erro ao criar perfil:', err);
    return res.status(500).json({ message: 'Erro interno ao criar perfil.' });
  }
}

// Editar perfil existente
export async function updatePerfil(req, res) {
  try {
    const { id } = req.params;
    const { nome, tipo } = req.body;

    const perfil = await Perfil.findByPk(id);
    if (!perfil) {
      return res.status(404).json({ message: 'Perfil não encontrado.' });
    }

    await perfil.update({
      nome: nome || perfil.nome,
      tipo: tipo || perfil.tipo
    });

    return res.status(200).json({ message: 'Perfil atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    return res.status(500).json({ message: 'Erro interno ao atualizar perfil.' });
  }
}

// Excluir perfil
export async function deletePerfil(req, res) {
  try {
    const { id } = req.params;

    const perfil = await Perfil.findByPk(id);
    if (!perfil) {
      return res.status(404).json({ message: 'Perfil não encontrado.' });
    }

    await perfil.destroy();

    return res.status(200).json({ message: 'Perfil excluído com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir perfil:', err);
    return res.status(500).json({ message: 'Erro interno ao excluir perfil.' });
  }
}
