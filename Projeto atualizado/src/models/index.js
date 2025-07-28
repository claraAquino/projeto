import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT || 5432,
    dialect:  'postgres',
    logging:  process.env.NODE_ENV === 'development' ? console.log : false
  }
);

// Usuário
export const Usuario = sequelize.define('Usuario', {
  id_usuario:    { type: DataTypes.INTEGER,  primaryKey: true, autoIncrement: true, field: 'id_usuario' },
  nome:          { type: DataTypes.STRING(255), allowNull: false, field: 'nome' },
  email:         { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true }, field: 'email' },
  senha_hash:    { type: DataTypes.STRING(255), allowNull: false, field: 'senha_hash' },
  data_cadastro: { type: DataTypes.DATE,       defaultValue: DataTypes.NOW, field: 'data_cadastro' },
  status:        { type: DataTypes.BOOLEAN,    defaultValue: false, field: 'status' }
}, {
  tableName: 'usuario',
  schema:    'schema',
  timestamps: false
});

// Perfil
export const Perfil = sequelize.define('Perfil', {
  id_perfil: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_perfil' },
  nome:      { type: DataTypes.STRING(100), allowNull: false, field: 'nome' },
  tipo:      { type: DataTypes.TEXT, field: 'tipo' }
}, {
  tableName: 'perfil',
  schema:    'schema',
  timestamps: false
});

// Associação Usuário–Perfil (many-to-many)
export const PerfilUsuario = sequelize.define('PerfilUsuario', {
  id_usuario: { type: DataTypes.INTEGER, primaryKey: true, field: 'id_usuario' },
  id_perfil:  { type: DataTypes.INTEGER, primaryKey: true, field: 'id_perfil' }
}, {
  tableName: 'perfil_usuario',
  schema:    'schema',
  timestamps: false
});

// Categoria
export const Categoria = sequelize.define('Categoria', {
  id_categoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_categoria' },
  nome:         { type: DataTypes.STRING(150), allowNull: false, field: 'nome' },
  descricao:    { type: DataTypes.TEXT, field: 'descricao' }
}, {
  tableName: 'categoria',
  schema:    'schema',
  timestamps: false
});


// Subcategoria
export const Subcategoria = sequelize.define('Subcategoria', {
  id_subcategoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_subcategoria' },
  nome:            { type: DataTypes.STRING(150), allowNull: false, field: 'nome' },
  descricao:       { type: DataTypes.TEXT, field: 'descricao' },
  id_categoria:    { type: DataTypes.INTEGER, allowNull: false, field: 'id_categoria' }
}, {
  tableName: 'subcategoria',
  schema:    'schema',
  timestamps: false
});


//DOCUMENTO
export const Documento = sequelize.define('Documento', {
  id_documento:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_documento' },
  id_subcategoria: { type: DataTypes.INTEGER, allowNull: false, field: 'id_subcategoria' },
  titulo:          { type: DataTypes.STRING(255), allowNull: false, field: 'titulo' },
  tipo:            { type: DataTypes.STRING(50), field: 'tipo' },
  arquivo:         { type: DataTypes.TEXT, field: 'arquivo' },
  data_criacao:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'data_criacao' },
  obsoleto:        { type: DataTypes.BOOLEAN, field: 'obsoleto' }
}, {
  tableName: 'documento',
  schema:    'schema',
  timestamps: false,
  onDelete: 'CASCADE'
});

// Sessão
export const Sessao = sequelize.define('Sessao', {
  id_sessao:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_sessao' },
  id_usuario:      { type: DataTypes.INTEGER, allowNull: false, field: 'id_usuario' },
  data_hora_login: { type: DataTypes.DATE, allowNull: false, field: 'data_hora_login' },
  data_hora_logout:{ type: DataTypes.DATE, field: 'data_hora_logout' },
  ultimo_acesso:   { type: DataTypes.DATE, field: 'ultimo_acesso' },
  token:           { type: DataTypes.TEXT, field: 'token' }
}, {
  tableName: 'sessao',
  schema:    'schema',
  timestamps: false
});

// Consulta
export const Consulta = sequelize.define('Consulta', {
  id_consulta:  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_consulta' },
  id_sessao:    { type: DataTypes.INTEGER, allowNull: false, field: 'id_sessao' },
  input:        { type: DataTypes.TEXT, allowNull: false, field: 'input' },
  data_consulta:{ type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'data_consulta' }
}, {
  tableName: 'consulta',
  schema:    'schema',
  timestamps: false
});

// Sugestão
export const Sugestao = sequelize.define('Sugestao', {
  id_sugestao: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_sugestao' },
  id_consulta: { type: DataTypes.INTEGER, allowNull: false, unique: true, field: 'id_consulta' },
  solucao:     { type: DataTypes.TEXT, allowNull: false, field: 'solucao' },
  id_documento:{ type: DataTypes.INTEGER, field: 'id_documento' },
  data_sugestao:{ type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'data_sugestao' },
  avaliacoes_positivas: { type: DataTypes.INTEGER, defaultValue: 0, field: 'avaliacoes_positivas' },
  avaliacoes_negativas: { type: DataTypes.INTEGER, defaultValue: 0, field: 'avaliacoes_negativas' },
}, {
  tableName: 'sugestao',
  schema:    'schema',
  timestamps: false
});

// Feedback
export const Feedback = sequelize.define('Feedback', {
  id_feedback:  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_feedback' },
  id_sugestao:  { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    field: 'id_sugestao',
    unique: true,  // Se quiser permitir só um feedback por sugestão, ok
    references: { model: Sugestao, key: 'id_sugestao' }
  },
  util:         { type: DataTypes.BOOLEAN, allowNull: false, field: 'util' },
  data_feedback:{ type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'data_feedback' }
}, {
  tableName: 'feedback',
  schema:    'schema',
  timestamps: false
});


// SoluçãoNãoEncontrada
export const SolucaoNaoEncontrada = sequelize.define('SolucaoNaoEncontrada', {
  id_solucaonaoencontrada: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_solucaonaoencontrada' },
  data_criacao:            { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'data_criacao' },
  id_consulta:             { type: DataTypes.INTEGER, allowNull: false, field: 'id_consulta' },
  input:                   { type: DataTypes.TEXT, allowNull: false, field: 'input' },
  statusdoc:               { type: DataTypes.STRING(20), allowNull: false, field: 'statusdoc' }
}, {
  tableName: 'solucaonaoencontrada',
  schema: 'schema',
  timestamps: false
});


//Codigo Recuperação
export const CodigoRecuperacao = sequelize.define('CodigoRecuperacao', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id'},
  id_usuario: { type: DataTypes.INTEGER, allowNull: false, field: 'id_usuario'},
  codigo: { type: DataTypes.STRING(10), allowNull: false, field: 'codigo'},
  expiracao: { type: DataTypes.DATE, allowNull: false, field: 'expiracao'},
  usado: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'usado'}
}, {
  tableName: 'codigo_recuperacao',
  schema: 'schema',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// DocumentoParagrafoEmbedding
export const DocumentoParagrafoEmbedding = sequelize.define('DocumentoParagrafoEmbedding', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_documento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Documento, 
      key: 'id_documento'
    },
    onDelete: 'CASCADE'
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  embedding: {
    type: DataTypes.JSONB,
    allowNull: false
  }
}, {
  tableName: 'documento_paragrafo_embedding',
  schema: 'schema',
  timestamps: false
});
//CACHE_REPOSTA
export const CacheResposta = sequelize.define('CacheResposta', {
  id_cache:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_cache' },
  input:        { type: DataTypes.TEXT, allowNull: false, field: 'input' },
  resposta:     { type: DataTypes.TEXT, allowNull: false, field: 'resposta' },
  score:        { type: DataTypes.FLOAT, field: 'score' },
  id_sugestao:  { type: DataTypes.INTEGER, field: 'id_sugestao' }
}, {
  tableName: 'cache_resposta',
  schema: 'schema',
  timestamps: false
});

// ─── Associação entre modelos ────────────────────────────────────────────────
Usuario.belongsToMany(Perfil, {
  through:    PerfilUsuario,
  as:         'perfis',
  foreignKey: 'id_usuario',
  otherKey:   'id_perfil',
  timestamps: false
});
Perfil.belongsToMany(Usuario, {
  through:    PerfilUsuario,
  as:         'usuarios',
  foreignKey: 'id_perfil',
  otherKey:   'id_usuario',
  timestamps: false
});

Usuario.hasMany(CodigoRecuperacao, { foreignKey: 'id_usuario' });
CodigoRecuperacao.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Categoria.hasMany(Subcategoria, { foreignKey: 'id_categoria', as: 'subcategorias' });
Subcategoria.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });

Subcategoria.hasMany(Documento, { foreignKey: 'id_subcategoria', as: 'documentos' });
Documento.belongsTo(Subcategoria, { foreignKey: 'id_subcategoria', as: 'subcategoria' });

Documento.hasMany(DocumentoParagrafoEmbedding, {foreignKey: 'id_documento', as: 'paragrafos'});
DocumentoParagrafoEmbedding.belongsTo(Documento, {foreignKey: 'id_documento', as: 'documento'});

Usuario.hasMany(Sessao,            { foreignKey: 'id_usuario' });
Sessao.belongsTo(Usuario,          { foreignKey: 'id_usuario' });

Sessao.hasMany(Consulta,           { foreignKey: 'id_sessao' });
Consulta.belongsTo(Sessao,         { foreignKey: 'id_sessao' });

Consulta.hasOne(Sugestao,          { foreignKey: 'id_consulta' });
Sugestao.belongsTo(Consulta,       { foreignKey: 'id_consulta' });

Sugestao.hasOne(Feedback,          { foreignKey: 'id_sugestao' });
Feedback.belongsTo(Sugestao,       { foreignKey: 'id_sugestao' });

Consulta.hasMany(SolucaoNaoEncontrada, { foreignKey: 'id_consulta' });
SolucaoNaoEncontrada.belongsTo(Consulta, { foreignKey: 'id_consulta' });

Sugestao.hasMany(CacheResposta, { foreignKey: 'id_sugestao' });
CacheResposta.belongsTo(Sugestao, { foreignKey: 'id_sugestao' });


// ─── Sincronização ────────────────────────────────────────────────────────────
export async function syncAll() {
  await sequelize.sync({ alter: true, searchPath: 'schema' });
  console.log('📦 Todos os modelos sincronizados.');
}
