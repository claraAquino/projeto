import { sequelize, Documento, Categoria, Subcategoria } from '../models/index.js';

export async function criarDocumento(req, res) {
  const t = await sequelize.transaction();

  try {
    const { titulo, tipo, arquivo, categoriaNome, subcategoriaNome } = req.body;

    // 1. Buscar ou criar Categoria
    let categoria = await Categoria.findOne({ where: { nome: categoriaNome }, transaction: t });
    if (!categoria) {
      categoria = await Categoria.create({ nome: categoriaNome }, { transaction: t });
    }

    // 2. Buscar ou criar Subcategoria
    let subcategoria = await Subcategoria.findOne({
      where: {
        nome: subcategoriaNome,
        id_categoria: categoria.id_categoria
      },
      transaction: t
    });

    if (!subcategoria) {
      subcategoria = await Subcategoria.create({
        nome: subcategoriaNome,
        id_categoria: categoria.id_categoria
      }, { transaction: t });
    }

    // 3. Criar Documento
    const documento = await Documento.create({
      titulo,
      tipo,
      arquivo,
      id_subcategoria: subcategoria.id_subcategoria
    }, { transaction: t });

    await t.commit();
    return res.status(201).json(documento);

  } catch (err) {
    await t.rollback();
    console.error('Erro ao criar documento:', err);
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
    const documento = await Documento.findByPk(id, {
      include: [
        {
          model: Subcategoria,

          as: 'subcategoria',
          include: [
            {
              model: Categoria,
              as: 'categoria'
            }
          ],

          include: [ Categoria ]

        }
      ]
    });
    if (!documento) {
      return res.status(404).json({ message: 'Documento não encontrado.' });
    }
    return res.status(200).json(documento);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao buscar documento.' });
  }
}

export async function atualizarDocumento(req, res) {
  try {
    const { id } = req.params;
    const { titulo, tipo, arquivo, categoriaNome, subcategoriaNome } = req.body;

    // Buscar ou criar Categoria e Subcategoria como no criarDocumento
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
