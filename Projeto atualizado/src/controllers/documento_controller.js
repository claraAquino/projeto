import { sequelize, Documento, Categoria, Subcategoria, DocumentoParagrafoEmbedding} from '../models/index.js';

import axios from 'axios';

export async function criarDocumento(req, res) {
  const t = await sequelize.transaction();

  try {
    const { titulo, tipo, arquivo, categoriaNome, subcategoriaNome } = req.body;

    if (!titulo || !tipo || !arquivo || !categoriaNome || !subcategoriaNome) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }

    let categoria = await Categoria.findOne({ where: { nome: categoriaNome }, transaction: t });
    if (!categoria) {
      categoria = await Categoria.create({ nome: categoriaNome }, { transaction: t });
    }

    let subcategoria = await Subcategoria.findOne({
      where: { nome: subcategoriaNome, id_categoria: categoria.id_categoria },
      transaction: t
    });

    if (!subcategoria) {
      subcategoria = await Subcategoria.create({
        nome: subcategoriaNome,
        id_categoria: categoria.id_categoria
      }, { transaction: t });
    }

    const documento = await Documento.create({
      titulo,
      tipo,
      arquivo,
      id_subcategoria: subcategoria.id_subcategoria
    }, { transaction: t });

    await t.commit();

    try {
      const embResp = await axios.post('http://localhost:8000/embeddings/documento', {
        id_documento: documento.id_documento,
        tipo,
        url: arquivo
      });
      console.log('✅ Embedding feito com sucesso:', embResp.data);
    } catch (err) {
      console.error('⚠️ Erro ao embeddar:', err.response?.data || err.message);
      
    }

    return res.status(201).json({
      message: 'Documento criado com sucesso.',
      documento
    });

  } catch (err) {
    await t.rollback();
    console.error('❌ Erro ao criar documento:', err);
    return res.status(500).json({ message: 'Erro ao criar documento.' });
  }
}



export async function listarDocumentos(req, res) {
  try {
    const documentos = await Documento.findAll({
      include: {
        model: Subcategoria,
        as: 'subcategoria',
        include: {
          model: Categoria,
          as: 'categoria'
        }
      }
    });
    return res.json(documentos);
  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    return res.status(500).json({ message: 'Erro ao listar documentos' });
  }
}


export async function buscarDocumentoPorId(req, res) {
  try {
    const { id } = req.params;

    const documento = await Documento.findOne({
      where: { id_documento: id },
      include: [
        {
          model: Subcategoria,
          as: 'subcategoria',
          include: [
            {
              model: Categoria,
              as: 'categoria'
            }
          ]
        }
      ]
    });

    if (!documento) {
      return res.status(404).json({ message: 'Documento não encontrado.' });
    }

    return res.status(200).json(documento);
  } catch (err) {
    console.error('Erro no buscarDocumentoPorId:', err);
    return res.status(500).json({ message: 'Erro ao buscar documento.' });
  }
}


export async function atualizarDocumento(req, res) {
  try {
    const { id } = req.params;
    const { titulo, tipo, arquivo, categoriaNome, subcategoriaNome } = req.body;

    
    let categoria = await Categoria.findOne({ where: { nome: categoriaNome } });
    if (!categoria) {
      categoria = await Categoria.create({ nome: categoriaNome });
    }

    let subcategoria = await Subcategoria.findOne({
      where: {
        nome: subcategoriaNome,
        id_categoria: categoria.id_categoria
      }
    });
    if (!subcategoria) {
      subcategoria = await Subcategoria.create({
        nome: subcategoriaNome,
        id_categoria: categoria.id_categoria
      });
    }

    const [atualizado] = await Documento.update(
      {
        titulo,
        tipo,
        arquivo,
        id_subcategoria: subcategoria.id_subcategoria
      },
      { where: { id_documento: id } }
    );

    if (!atualizado) {
      return res.status(404).json({ message: 'Documento não encontrado.' });
    }

    return res.status(200).json({ message: 'Documento atualizado.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao atualizar documento.' });
  }
}

export async function deletarDocumento(req, res) {
  try {
    const { id } = req.params;

    // Apaga paragrafos relacionados primeiro
    await DocumentoParagrafoEmbedding.destroy({ where: { id_documento: id } });

    // Agora apaga o documento
    const deletado = await Documento.destroy({ where: { id_documento: id } });

    if (!deletado) {
      return res.status(404).json({ message: 'Documento não encontrado.' });
    }

    return res.status(200).json({ message: 'Documento excluído.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao excluir documento.' });
  }
}

export async function listarCategoriaComSubcategoria(req, res) {
  try {
    const categorias = await Categoria.findAll({
      attributes: ['id_categoria', 'nome'],
      include: [{
        model: Subcategoria,
        as: 'subcategorias',
        attributes: ['id_subcategoria', 'nome']
      }],
      order: [
        ['nome', 'ASC'],
        [{ model: Subcategoria, as: 'subcategorias' }, 'nome', 'ASC']
      ]
    });

    return res.status(200).json(categorias);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao listar categoria com subcategorias.' });
  }
}

export async function contarDocumentos(req, res) {
  try {
    const total = await Documento.count();
    return res.json({ total });
  } catch (error) {
    console.error('Erro ao contar documentos:', error);
    return res.status(500).json({ message: 'Erro ao contar documentos' });
  }
}
