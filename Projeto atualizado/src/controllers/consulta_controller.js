import axios from 'axios';
import { Consulta, Sugestao } from '../models/index.js'; // importe Sugestao

export async function criarConsulta(req, res) {
  try {
    const { pergunta, id_sessao, id_subcategoria } = req.body;

    if (!pergunta || !id_sessao || !id_subcategoria) {
      return res.status(400).json({ erro: 'Pergunta, sessão ou subcategoria não informada.' });
    }

    console.log('[INFO] Criando nova consulta para a pergunta:', pergunta);

    // === 1. Salva a consulta no banco ===
    let novaConsulta;
    try {
      novaConsulta = await Consulta.create({
        id_sessao,
        input: pergunta,
        data_consulta: new Date()
      });
      console.log('[DB] Consulta salva com sucesso. ID:', novaConsulta.id_consulta);
    } catch (erroCriacao) {
      console.error('[ERRO] Falha ao salvar consulta:', erroCriacao);
      return res.status(500).json({ erro: 'Erro ao salvar a consulta no banco.' });
    }

    // === 2. Chama a API Python para gerar resposta ===
    let respostaAPI;
    try {
      respostaAPI = await axios.post('http://localhost:8000/responder', {
        pergunta,
        id_subcategoria: parseInt(id_subcategoria, 10)
      });
    } catch (erroResposta) {
      console.error('[ERRO] Erro ao obter resposta da API Python:', erroResposta.message);
      return res.status(500).json({ erro: 'Erro ao obter resposta da IA.' });
    }

        // === 3. Salva a resposta como sugestão no banco ===
    let novaSugestao;
    try {
      const dataSugestao = {
        id_consulta: novaConsulta.id_consulta,
        solucao: respostaAPI.data.resposta || "Resposta não fornecida",
        id_documento: respostaAPI.data.id_documento || null,
        data_sugestao: new Date()
      };

      novaSugestao = await Sugestao.create(dataSugestao);
      console.log('[DB] Sugestão salva com sucesso para consulta:', novaConsulta.id_consulta);

    } catch (erroSugestao) {
      console.error('[ERRO] Falha ao salvar sugestão:', erroSugestao);
      // opcional: não interrompe o fluxo, só avisa
    }

    // === 4. Retorna a resposta para o frontend incluindo id_sugestao ===
    return res.status(200).json({
      ...respostaAPI.data,
      id_sugestao: novaSugestao ? novaSugestao.id_sugestao : null
    }); 

  } catch (erroGeral) {
    console.error('[ERRO] Erro geral ao processar consulta:', erroGeral);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
}
