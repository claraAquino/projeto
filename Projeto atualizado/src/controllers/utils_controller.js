// src/controllers/utils_controller.js
import { Usuario, CodigoRecuperacao } from '../models/index.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_APP,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

export async function enviarCodigo(req, res) {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ message: 'E-mail não cadastrado.' });

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiracao = new Date(Date.now() + 5 * 60000);

    await CodigoRecuperacao.create({
      id_usuario: usuario.id_usuario,
      codigo,
      expiracao,
      usado: false
    });

    await transporter.sendMail({
      from: `"Bot de Atendimento" <${process.env.EMAIL_APP}>`,
      to: email,
      subject: 'Código para recuperação de senha',
      html: `
        <h2>Recuperação de Senha</h2>
        <p>Olá, ${usuario.nome}!</p>
        <p>Use o código abaixo para redefinir sua senha:</p>
        <div style="font-size: 20px; font-weight: bold;">${codigo}</div>
        <p>Este código expira em 5 minutos.</p>
      `
    });

    res.status(200).json({ message: 'Código enviado com sucesso.' });
  } catch (error) {
    console.error('Erro ao enviar código:', error);
    res.status(500).json({ message: 'Erro interno ao enviar código.' });
  }
}

export async function verificarCodigo(req, res) {
  const { email, codigo } = req.body;

  const registro = await CodigoRecuperacao.findOne({
    where: { codigo, usado: false },
    include: { model: Usuario, where: { email } },
    order: [['createdAt', 'DESC']]
  });

  if (!registro) return res.status(400).json({ message: 'Código inválido.' });

  if (new Date() > new Date(registro.expiracao)) {
    return res.status(400).json({ message: 'Código expirado.' });
  }

  return res.json({ message: 'Código válido. Pode redefinir a senha.' });
}

export async function redefinirSenha(req, res) {
  const { email, codigo, novaSenha } = req.body;

  const registro = await CodigoRecuperacao.findOne({
    where: { codigo, usado: false },
    include: { model: Usuario, where: { email } },
    order: [['createdAt', 'DESC']]
  });

  if (!registro) return res.status(400).json({ message: 'Código inválido.' });
  if (new Date() > new Date(registro.expiracao)) {
    return res.status(400).json({ message: 'Código expirado.' });
  }

  await Usuario.update({ senha: novaSenha }, { where: { email } });

  registro.usado = true;
  await registro.save();

  return res.json({ message: 'Senha atualizada com sucesso!' });
}
