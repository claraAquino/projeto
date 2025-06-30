import { PerfilUsuario } from '../models/perfilUsuario_model.js';
import { Usuario } from '../models/usuario_model.js';
import { Perfil } from '../models/perfil_model.js';

// Criar vínculo entre usuário e perfil
export async function vincularPerfil(req, res) {
  try {
    const { id_usuario, id_perfil } = req.body;

    if (!id_usuario || !id_perfil) {
      return res.status(400).json({ message: 'id_usuario e id_perfil são obrigatórios.' });
    }

    await PerfilUsuario.create({ id_usuario, id_perfil });
    res.status(201).json({ message: 'Perfil vinculado com sucesso.' });
  } catch (err) {
    console.error('Erro ao vincular perfil:', err);
    res.status(500).json({ message: 'Erro ao vincular perfil.' });
  }
}

// Listar todos os vínculos
export async function listarVinculos(req, res) {
  try {
    const vinculos = await PerfilUsuario.findAll({ include: [Usuario, Perfil] });
    res.json(vinculos);
  } catch (err) {
    console.error('Erro ao listar vínculos:', err);
    res.status(500).json({ message: 'Erro ao listar vínculos.' });
  }
}

// Remover vínculo específico
export async function desvincularPerfil(req, res) {
  try {
    const { id_usuario, id_perfil } = req.params;

    const deletado = await PerfilUsuario.destroy({
      where: { id_usuario, id_perfil }
    });

    if (!deletado) {
      return res.status(404).json({ message: 'Vínculo não encontrado.' });
    }

    res.json({ message: 'Vínculo removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover vínculo:', err);
    res.status(500).json({ message: 'Erro ao remover vínculo.' });
  }
}
