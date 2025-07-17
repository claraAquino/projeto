import { Perfil } from '../models/perfil_model.js';

export async function createPerfil(req, res) {
  try {
    const { nome, tipo } = req.body;

    if (!nome) {
      return res.status(400).json({ message: 'Nome é obrigatório.' });
    }

    // Verifica se já existe perfil com mesmo nome
    const perfilExistente = await Perfil.findOne({ where: { nome } });
    if (perfilExistente) {
      return res.status(409).json({ message: 'Perfil já existe.' });
    }

    const novoPerfil = await Perfil.create({ nome, tipo });

    return res.status(201).json(novoPerfil);
  } catch (err) {
    console.error('Erro ao criar perfil:', err);
    return res.status(500).json({ message: 'Erro interno ao criar perfil.', error: err.message });
  }
}

// Listar todos os perfis
export async function getPerfis(req, res) {
  try {
    const perfis = await Perfil.findAll();
    return res.status(200).json(perfis);
  } catch (err) {
    console.error('Erro ao buscar perfis:', err);
    return res.status(500).json({ message: 'Erro interno ao buscar perfis.' });
  }
}


// Atualizar perfil
export async function updatePerfil(req, res) {
  try {
    const { id } = req.params;
    const { nome, tipo } = req.body;  // pode atualizar nome e tipo

    const perfil = await Perfil.findByPk(id);
    if (!perfil) {
      return res.status(404).json({ message: 'Perfil não encontrado.' });
    }

    // Atualiza os campos, se forem enviados
    if (nome !== undefined) perfil.nome = nome;
    if (tipo !== undefined) perfil.tipo = tipo;

    await perfil.save();

    return res.status(200).json(perfil);
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
