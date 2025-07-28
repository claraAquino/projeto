import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import { Usuario, Perfil, Sessao} from '../models/index.js';
import jwt from 'jsonwebtoken';


//
//criando usuário pelo administrador
  export async function createUserByAdm(req, res) {
  console.log("📥 [Admin] POST /users");

  try {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({ message: 'Campos obrigatórios: nome, email, senha e perfil.' });
    }

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const perfilEncontrado = await Perfil.findByPk(perfil);
    if (!perfilEncontrado) {
      return res.status(400).json({ message: 'Perfil informado é inválido.' });
    }

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha_hash,
      status: true
    });

    await novoUsuario.addPerfis(perfilEncontrado);

    const usuarioComPerfis = await Usuario.findByPk(novoUsuario.id_usuario, {
      include: [{ model: Perfil, as: 'perfis' }]
    });

    return res.status(201).json(usuarioComPerfis);
  } catch (err) {
    console.error("❌ Erro ao criar usuário:", err);
    return res.status(500).json({ message: 'Erro interno ao cadastrar usuário.' });
  }
}

//
// Atualiza usuário existente
  export async function updateUser(req, res) {
    console.log("Requisição PUT/PATCH para atualizar usuário.");

    try {
      const { id } = req.params;
      const { nome, email, senha,status, perfil } = req.body;

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
  status
});

if (perfil) {
  // Remove perfis antigos e atribui o novo
  const perfilEntidade = await Perfil.findByPk(perfil);
  if (perfilEntidade) {
    await usuario.setPerfis([perfilEntidade]);
  }
}

      return res.status(200).json({ message: 'Usuário atualizado com sucesso.',
        nome: nome || usuario.nome,
        email: email || usuario.email,
        status,
        id_perfil: perfil !== undefined ? perfil : usuario.id_perfil
      });

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

    // Deletar todas as sessões vinculadas antes
    await Sessao.destroy({ where: { id_usuario: id } });

    // Agora pode deletar o usuário
    await usuario.destroy();

    return res.status(200).json({ message: 'Usuário excluído com sucesso.' });

  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    return res.status(500).json({ message: 'Erro interno ao excluir usuário.' });
  }
}


//atribuição de perfil ao usuário
export async function atribuirPerfilAoUsuario(req, res) {
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

// Faz login de usuário
export async function loginUser(req, res) {
  try {
    const { email, senha, forcarLogin = false } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    const usuario = await Usuario.findOne({
      where: { email },
      include: [{
        model: Perfil,
        as: 'perfis',
        through: { attributes: [] }
      }]
    });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    if (!usuario.status) {
      return res.status(403).json({ message: 'Usuário suspenso por um administrador.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Verifica se já existe uma sessão ativa
    const sessaoAtiva = await Sessao.findOne({
      where: {
        id_usuario: usuario.id_usuario,
        data_hora_logout: null
      }
    });

    if (sessaoAtiva) {
      if (!forcarLogin) {
        // Solicita confirmação ao usuário
        return res.status(409).json({
          message: 'Já existe uma sessão ativa para este usuário. Deseja encerrar a sessão anterior?',
          requerConfirmacao: true
        });
      } else {
        // Encerra sessão anterior
        console.log(`Encerrando sessões antigas do usuário ${usuario.id_usuario}...`);
        const [qtdEncerradas] = await Sessao.update(
          { data_hora_logout: new Date() },
          {
            where: {
              id_usuario: usuario.id_usuario,
              data_hora_logout: null
            }
          }
        );
        console.log(`Quantidade de sessões encerradas: ${qtdEncerradas}`);
        if (qtdEncerradas === 0) {
          console.warn("Nenhuma sessão antiga foi encerrada, revise os dados no banco.");
        }
      }
    }

    // Gera token JWT
const token = jwt.sign(
  {
    id_usuario: usuario.id_usuario,
    email: usuario.email,
    perfis: usuario.perfis.map(p => p.id_perfil)
  },
  process.env.JWT_SECRET,
  { expiresIn: '1h' } // ou o tempo que desejar
);

    // Cria nova sessão
    const novaSessao = await Sessao.create({
    id_usuario: usuario.id_usuario,
    data_hora_login: new Date(),
    ultimo_acesso: new Date(),
    data_hora_logout: null,
    token
  });

    return res.status(200).json({
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      perfis: usuario.perfis.map(p => ({
        id_perfil: p.id_perfil,
        nome: p.nome
      })),
      token,
      id_sessao: novaSessao.id_sessao
    });

  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ message: 'Erro interno no login.' });
  }
}

// Lista todos os usuários
export async function getUsers(req, res) {
  try {
 const usuarios = await Usuario.findAll({
  attributes: ['id_usuario', 'nome', 'email', 'status'],
  include: [
    {
      model: Perfil,
      as: 'perfis',
      attributes: ['id_perfil', 'tipo'],
      through: { attributes: [] }
    }
  ],

});
    return res.status(200).json(usuarios);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    return res.status(500).json({ message: 'Erro interno ao buscar usuários.' });
  }
}

export async function getUsuarioPorEmail(req, res) {
  // implementação da função
}

  
export async function toggleStatusUsuario(req, res) {
  console.log("Tipo do status recebido:", typeof req.body.status);
  console.log("Valor do status recebido:", req.body.status);
  try {
    const id_usuario = req.params.id_usuario;
    const { status } = req.body;

    console.log(`[toggleStatusUsuario] id_usuario: ${id_usuario}, status recebido:`, status);

    if (typeof status !== 'boolean') {
      console.log("[toggleStatusUsuario] Tipo inválido para status:", typeof status);
      return res.status(400).json({ message: "Campo 'status' deve ser booleano." });
    }

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      console.log("[toggleStatusUsuario] Usuário não encontrado com id:", id_usuario);
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    usuario.status = status;
    await usuario.save();

    console.log(`[toggleStatusUsuario] Status atualizado para: ${status ? "Ativo" : "Inativo"}`);

    return res.status(200).json({ message: `Status atualizado para ${status ? "Ativo" : "Inativo"}.` });
  } catch (error) {
    console.error("Erro ao atualizar status do usuário:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function getUserByToken(req, res) {
  try {
    const { id_usuario } = req.usuario;

    const usuario = await Usuario.findByPk(id_usuario, {
      attributes: ['id_usuario', 'nome', 'email', 'status', 'data_cadastro'],
      include: [{
        model: Perfil,
        as: 'perfis',
        through: { attributes: [] }
      }]
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao obter usuário logado:', error);
    return res.status(500).json({ message: 'Erro interno ao buscar usuário.' });
  }
}
