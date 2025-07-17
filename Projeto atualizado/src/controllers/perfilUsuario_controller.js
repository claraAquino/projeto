import { Usuario, Perfil } from '../models/index.js';


// Atribuir perfil a usuário
export async function atribuirPerfilAoUsuario(req, res) {
  console.log('➡️ Entrou na função atribuirPerfilAoUsuario'); // 👈 ADICIONE ISSO
  try {
    const { id_usuario } = req.params;
    const { id_perfil } = req.body;

    // Verificar se o usuário existe
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    // Verificar se o perfil existe
    const perfil = await Perfil.findByPk(id_perfil);
    if (!perfil) {
      return res.status(404).json({ mensagem: 'Perfil não encontrado.' });
    }

    // Fazer a associação (inserção na tabela perfil_usuario)
    await usuario.addPerfil(perfil);

    return res.status(200).json({ mensagem: 'Perfil atribuído ao usuário com sucesso.' });
  } catch (erro) {
    console.error('Erro ao atribuir perfil:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao atribuir perfil.' });
  }
}
// Remover perfil de usuário
export async function removerPerfil(req, res) {
  try {
    const { id_usuario, id_perfil } = req.params;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado.' });

    const perfil = await Perfil.findByPk(id_perfil);
    if (!perfil) return res.status(404).json({ message: 'Perfil não encontrado.' });

    const perfis = await usuario.getPerfis();
    const temPerfil = perfis.some(p => p.id_perfil === perfil.id_perfil);
    if (!temPerfil) {
      return res.status(400).json({ message: 'Usuário não possui esse perfil.' });
    }

    await usuario.removePerfil(perfil);
    return res.status(200).json({ message: 'Perfil removido do usuário com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover perfil:', err);
    return res.status(500).json({ message: 'Erro interno ao remover perfil.' });
  }
}

// Trocar perfil do usuário (remove todos os antigos e adiciona um novo)
export async function trocarPerfilDoUsuario(req, res) {
  try {
    const { id_usuario } = req.params;
    const { id_perfil } = req.body;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    const perfil = await Perfil.findByPk(id_perfil);
    if (!perfil) {
      return res.status(404).json({ mensagem: 'Perfil não encontrado.' });
    }

    // Remove todos os perfis atuais e define apenas o novo
    await usuario.setPerfis([perfil]);

    return res.status(200).json({ mensagem: 'Perfil do usuário atualizado com sucesso.' });
  } catch (erro) {
    console.error('Erro ao trocar perfil:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao trocar perfil.' });
  }
}
