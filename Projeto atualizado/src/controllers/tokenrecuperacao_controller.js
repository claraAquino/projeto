import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { Usuario } from '../models/usuario_model.js';
import { TokenRecuperacao } from '../models/tokenrecuperacao_model.js';

console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS)

export async function solicitarRecuperacao(req, res) {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

   
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    
    await TokenRecuperacao.create({
      id_usuario: usuario.id_usuario,
      token: codigo,
      expiracao: new Date(Date.now() + 5 * 60 * 1000) 
    });

    // Envia o e-mail com o código
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Código de Recuperação de Senha',
      text: `Seu código de verificação é: ${codigo}`,
      html: `<p>Seu código de verificação é:</p><h2>${codigo}</h2><p>Este código expira em 5 minutos.</p>`
    });

    return res.json({ mensagem: 'Código de verificação enviado por e-mail.' });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao enviar o e-mail.' });
  }
}

export const redefinirSenha = async (req, res) => {
  const { email, token, novaSenha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const registro = await TokenRecuperacao.findOne({
      where: {
        id_usuario: usuario.id_usuario,
        token: token,
      },
    });

    if (!registro) return res.status(400).json({ erro: 'Token inválido' });

    const agora = new Date();
    if (registro.expiracao < agora) {
      return res.status(400).json({ erro: 'Token expirado' });
    }

    
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    
    await Usuario.update(
      { senha_hash: novaSenhaHash },
      { where: { id_usuario: usuario.id_usuario } }
    );

   
    await TokenRecuperacao.destroy({ where: { id: registro.id } });

    return res.status(200).json({ mensagem: 'Senha redefinida com sucesso' });
  } catch (erro) {
    console.error('[ERRO] Falha ao redefinir senha:', erro);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
