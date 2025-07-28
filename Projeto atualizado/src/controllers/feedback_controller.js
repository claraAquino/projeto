import fs from 'fs';
import path from 'path';
import { Feedback, Sugestao } from '../models/index.js';

const CACHE_PATH = path.resolve('cache_respostas.json');

export const registrarFeedback = async (req, res) => {
  const { id_sugestao, util, pergunta, resposta, paragrafo, documento_url, similaridade } = req.body;

  if (!id_sugestao) {
    return res.status(400).json({ erro: 'id_sugestao é obrigatório.' });
  }

  try {
    
    const utilBool = util === true || util === 'true';

    
    const feedbackExistente = await Feedback.findOne({ where: { id_sugestao } });

    if (feedbackExistente) {
      feedbackExistente.util = utilBool;
      await feedbackExistente.save();
    } else {
      await Feedback.create({ id_sugestao, util: utilBool });
    }

    
    const sugestao = await Sugestao.findByPk(id_sugestao);
    if (!sugestao) {
      return res.status(404).json({ erro: 'Sugestão não encontrada' });
    }

    if (utilBool) {
      sugestao.avaliacoes_positivas = (sugestao.avaliacoes_positivas || 0) + 1;
    } else {
      sugestao.avaliacoes_negativas = (sugestao.avaliacoes_negativas || 0) + 1;
    }
    await sugestao.save();

    
    if (utilBool && pergunta && resposta) {
      let cache = {};
      if (fs.existsSync(CACHE_PATH)) {
        try {
          const dados = fs.readFileSync(CACHE_PATH, 'utf-8');
          cache = JSON.parse(dados);
        } catch {
          cache = {};
        }
      }

      const chave_cache = pergunta.toLowerCase();

      cache[chave_cache] = {
        resposta,
        paragrafo,
        url: documento_url,
        score: similaridade
      };

      try {
        fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
        console.log('[CACHE] Resposta adicionada com sucesso.');
      } catch (err) {
        console.error('[ERRO] Ao salvar cache:', err);
      }
    }

    res.status(200).json({ mensagem: 'Feedback registrado com sucesso.' });

  } catch (erro) {
    console.error('[ERRO] Ao registrar feedback:', erro);
    res.status(500).json({ erro: 'Erro ao registrar o feedback.' });
  }
};
