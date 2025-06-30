import bcrypt from 'bcrypt';
import { Usuario } from '../models/usuario_model.js';

export async function createUser(req, res) {
  console.log("Chegou uma requisição POST em /users");

  try {
    const { nome, email, senha, perfil } = req.body;

    // Verificações básicas de entrada
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Campos obrigatórios: nome, email e senha.' });
    }

    // Verifica se o e-mail já está cadastrado
    const exists = await Usuario.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }

    // Gera o hash da senha
    const saltRounds = 10;
    const senha_hash = await bcrypt.hash(senha, saltRounds);

    // Cria novo usuário
    const novo = await Usuario.create({
      nome,
      email,
      senha_hash,
      id_perfil: perfil || null // opcionalmente define o perfil, se enviado
    });

    // Retorno seguro (não envia hash de senha)
    return res.status(201).json({
      id_usuario: novo.id_usuario,
      nome: novo.nome,
      email: novo.email
    });

  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    return res.status(500).json({ message: 'Erro interno ao cadastrar usuário.' });
  }
}

// Atualiza usuário existente
export async function updateUser(req, res) {
  console.log("Requisição PUT/PATCH para atualizar usuário.");

  try {
    const { id } = req.params;
    const { nome, email, senha, perfil } = req.body;

    // Busca o usuário pelo ID
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Se o usuário quiser alterar a senha, gera novo hash
    let senha_hash = usuario.senha_hash;
    if (senha) {
      const saltRounds = 10;
      senha_hash = await bcrypt.hash(senha, saltRounds);
    }

    // Atualiza os campos (se enviados)
    await usuario.update({
      nome: nome || usuario.nome,
      email: email || usuario.email,
      senha_hash,
      id_perfil: perfil !== undefined ? perfil : usuario.id_perfil
    });

    return res.status(200).json({ message: 'Usuário atualizado com sucesso.' });

  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    return res.status(500).json({ message: 'Erro interno ao atualizar usuário.' });
  }
}

// Deleta usuário
export async function deleteUser(req, res) {
  console.log("Requisição DELETE para excluir usuário.");

  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await usuario.destroy();

    return res.status(200).json({ message: 'Usuário excluído com sucesso.' });

  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    return res.status(500).json({ message: 'Erro interno ao excluir usuário.' });
  }
}