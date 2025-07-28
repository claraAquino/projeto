import jwt from 'jsonwebtoken';
import { Usuario, Perfil, Sessao } from '../models/index.js';

const TEMPO_INATIVIDADE = 15 * 60 * 1000; // 15 minutos

export const autenticar = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('🔑 Token recebido:', token);
  if (!token) return res.status(401).json({ erro: 'Token não fornecido.' });

  try {
    // Decodifica e valida o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decodificado:', decoded);

    // Busca sessão ativa com esse token
    const sessao = await Sessao.findOne({
      where: {
        id_usuario: decoded.id_usuario,
        token: token,
        data_hora_logout: null
      }
    });

    console.log('📋 Sessão encontrada:', sessao);

    if (!sessao) {
      console.warn('⚠️ Sessão não encontrada ou já encerrada.');
      return res.status(401).json({ erro: 'Sessão expirada, encerrada ou inválida.' });
    }

    // Verifica inatividade
    const agora = Date.now();
    const ultimoAcesso = sessao.ultimo_acesso
      ? new Date(sessao.ultimo_acesso).getTime()
      : new Date(sessao.data_hora_login).getTime();

    console.log('⏰ Agora:', new Date(agora).toISOString());
    console.log('⏰ Último acesso:', new Date(ultimoAcesso).toISOString());
    console.log('⏳ Diferença (ms):', agora - ultimoAcesso);
    console.log('⏳ Tempo permitido (ms):', TEMPO_INATIVIDADE);

    if (agora - ultimoAcesso > TEMPO_INATIVIDADE) {
      console.warn('⏳ Sessão expirada por inatividade.');
      // Marca a sessão como finalizada por inatividade
      await Sessao.update(
        { data_hora_logout: new Date() },
        { where: { id_sessao: sessao.id_sessao } }
      );
      return res.status(401).json({ erro: 'Sessão expirada por inatividade.' });
    }

    // Atualiza o último acesso
    await Sessao.update(
      { ultimo_acesso: new Date() },
      { where: { id_sessao: sessao.id_sessao } }
    );
    console.log('✅ Último acesso atualizado para agora.');

    // Busca usuário e perfis
    const usuario = await Usuario.findByPk(decoded.id_usuario, {
      include: [{
        model: Perfil,
        as: 'perfis',
        through: { attributes: [] }
      }]
    });

    if (!usuario) {
      console.warn('❌ Usuário não encontrado.');
      return res.status(403).json({ erro: 'Usuário não encontrado.' });
    }

    if (!usuario.status) {
      console.warn('❌ Usuário desativado.');
      return res.status(403).json({ erro: 'Sua conta está desativada. Acesso negado.' });
    }

    // Anexa ao req para uso nas rotas protegidas
    req.usuario = {
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      perfis: usuario.perfis.map(p => p.id_perfil)
    };

    next();
  } catch (error) {
    console.error('❌ Erro na autenticação:', error);
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};

export async function validarSessao(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('🔑 Validar sessão - Token recebido:', token);
    if (!token) return res.status(401).json({ erro: 'Token não fornecido.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Validar sessão - Token decodificado:', decoded);

    const sessao = await Sessao.findOne({
      where: {
        id_usuario: decoded.id_usuario,
        token,
        data_hora_logout: null
      }
    });

    console.log('📋 Validar sessão - Sessão encontrada:', sessao);

    if (!sessao) {
      console.warn('⚠️ Validar sessão - Sessão expirada ou encerrada.');
      return res.status(401).json({ erro: 'Sessão expirada ou encerrada.' });
    }

    // (Opcional) Atualiza o último acesso
    sessao.ultimo_acesso = new Date();
    await sessao.save();
    console.log('✅ Validar sessão - Último acesso atualizado.');

    return res.status(200).json({
      mensagem: 'Sessão válida.',
      usuario: {
        id_usuario: decoded.id_usuario,
        email: decoded.email,
        perfis: decoded.perfis
      }
    });
  } catch (error) {
    console.error('❌ Erro na validação de sessão:', error);
    return res.status(401).json({ erro: 'Sessão inválida ou expirada.' });
  }
}
