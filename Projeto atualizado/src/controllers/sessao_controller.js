import { Sessao } from '../models/index.js';
import { dataHoraLocal } from '../utils/data.js'; 

export async function iniciarSessao(req, res) {
  try {
    const { id_usuario, token } = req.body;

    const agora = dataHoraLocal();

    
    await Sessao.update(
      { data_hora_logout: agora },
      {
        where: {
          id_usuario,
          data_hora_logout: null
        }
      }
    );



    const sessao = await Sessao.create({
      id_usuario,
      data_hora_login: agora,
      ultimo_acesso: agora,
      token
    });

    return res.status(201).json(sessao);
  } catch (err) {
    console.error('Erro ao iniciar sessão:', err);
    return res.status(500).json({ mensagem: 'Erro ao iniciar sessão.' });
  }
}


export async function encerrarSessao(req, res) {
  console.log("Hora local usada para logout:", dataHoraLocal(), typeof dataHoraLocal());
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ mensagem: 'Token não fornecido.' });

    const sessao = await Sessao.findOne({
      where: { token, data_hora_logout: null }
    });

    if (!sessao) {
      return res.status(404).json({ mensagem: 'Sessão não encontrada ou já encerrada.' });
    }
    await Sessao.update(
      { data_hora_logout: dataHoraLocal() },
      { where: { id_sessao: sessao.id_sessao } }
    );
    console.log("Encerrando sessão ID:", sessao.id_sessao);
    console.log("Data logout:", dataHoraLocal(), typeof dataHoraLocal());

    return res.status(200).json({ mensagem: 'Sessão encerrada com sucesso.' });
  } catch (err) {
    console.error('Erro ao encerrar sessão:', err);
    return res.status(500).json({ mensagem: 'Erro ao encerrar sessão.' });
  }
}


