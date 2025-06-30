import {Sequelize, DataTypes} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
 process.env.DB_NAME,
 process.env.DB_USER,
 process.env.DB_PASS,
 {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: process.env.NODE_ENV ==='development' ? console.log : false,
 }
);

//USUÁRIO
export const Usuario = sequelize.define('Usuario', {
  id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_usuario' },
  nome: { type: DataTypes.STRING(255), allowNull:false, field: 'nome' },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true }, field: 'email' },
  senha_hash: { type: DataTypes.STRING(255), allowNull: false, field: 'senha_hash' },
  data_cadastro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field:'data_cadastro' }
}, {
  tableName: 'usuario',
  timestamps: false
});

//PERFIL
export const Perfil = sequelize.define('Perfil',{
  id_perfil: {type : DataTypes.INTEGER, primaryKey:true, autoIncrement: true, field: 'id_perfil'},
  nome: {type: DataTypes.STRING(100), allowNull:false, field:'nome'},
  tipo: {type: DataTypes.TEXT, field:'tipo'}
},{
  tableName:'perfil',
  timestamps:false
});

//ASSOCIAÇÃO USUÁRIO E PERFIL
export const PerfilUsuario = sequelize.define('PerfilUsuario',{
  id_usuario: {type: DataTypes.INTEGER, primaryKey: true, field:'id_usuario'},
  id_perfil: {type: DataTypes.INTEGER, primaryKey: true, field: 'id_perfil'}
},{
  tableName: 'perfil_usuario',
  timestamps: false
});


//TEMA
export const Tema = sequelize.define('Tema',{
  id_tema: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_tema'},
  nome: {type:DataTypes.STRING(150), allowNull: false, field:'nome'},
  descricao: {type:DataTypes.TEXT, field:'descricao'}
},{
  tableName:'tema',
  timestamps:false
});

//ASSUNTO 
export const Assunto = sequelize.define('Assunto',{
  id_assunto: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_assunto'},
  nome: {type: DataTypes.STRING(150), allowNull: false, field:'nome'},
  descricao: {type: DataTypes.TEXT, field:'descricao'},
  id_tema: {type: DataTypes.INTEGER, allowNull:false, field:'id_tema' }
},{
  tableName:'assunto',
  timestamps:false
});

//DOCUMENTO
export const Documento = sequelize.define('Documento',{
  id_documento: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_documento'},
  assunto: {type: DataTypes.INTEGER, allowNull:false, field: 'id_assunto'},
  titulo: {type: DataTypes.STRING(255), allowNull: false, field:'titulo'},
  tipo: {type:DataTypes.STRING(50), field:'tipo'},
  arquivo:{type:DataTypes.TEXT, field:'arquivo'},
  data_criacao: {type:DataTypes.DATE, defaultValue: DataTypes.NOW, field:'data_criacao'}
},{
  tableName: 'documento',
  timestamps: false
});

//SESSÃO
export const Sessao = sequelize.define('Sessao',{
  id_sessao: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_sessao'},
  id_usuario: {type: DataTypes.INTEGER, allowNull: false,field:'id_usuario'},
  data_hora_login:{type: DataTypes.DATE, defaultValue: DataTypes.NOW,field:'data_hora_login'},
  data_hora_logout:{type: DataTypes.DATE, field:'data_hora_logout'}
},{
  tableName:'sessao',
  timestamps:false
});

//CONSULTA
export const Consulta = sequelize.define('Consulta',{
  id_consulta: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field:'id_consulta'},
  id_sessao:{type: DataTypes.INTEGER, allowNull: false, field:'id_sessao'},
  input: {type: DataTypes.TEXT, allowNull: false, field:'input'},
  data_consulta: {type: DataTypes.DATE, defaultValue: DataTypes.NOW, field:'data_consulta'}
},{
  tableName:'consulta',
  timestamps:false
});

//SOLUÇÃO
export const Sugestao = sequelize.define('Sugestao',{
  id_sugestao: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field:'id_sugestao'},
  id_consulta: {type:DataTypes.INTEGER, allowNull: false, unique: true, field:'id_consulta'},
  solucao: {type: DataTypes.TEXT, allowNull: false, field:'solucao'},
  id_documento: {type: DataTypes.INTEGER, field:'id_documento'},
  data_sugestao: {type: DataTypes.DATE, defaultValue: DataTypes.NOW, field:'data_sugestao'}
},{
  tableName:'sugestao',
  timestamps: false
});

//FEEDBACK
export const Feedback = sequelize.define('Feedback',{
  id_feedback: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field:'id_feedback'},
  id_consulta: {type: DataTypes.INTEGER, allowNull: false, unique: true, field:'id_consulta'},
  util: {type: DataTypes.BOOLEAN, allowNull: false, field:'util'},
  data_sugestao:{type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'data_feedback'}
},{
  tableName:'feedback',
  timestamps:false
});

//SOLUÇÃO_NÃO_ENCONTRADA
export const Solucaonaoencontrada = sequelize.define('Solucaonaoencontrada',{
  id_solucaonaoencontrada: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field:'id_solucaonaoencontrada'},
  data_criacao:{type: DataTypes.DATE, defaultValue: DataTypes.NOW, field:'data_criacao'},
  id_consulta:{type: DataTypes.INTEGER, allowNull: false, field:'id_consulta'},
  input:{type: DataTypes.TEXT, allowNull: false, field:'input'},
   status: {type: DataTypes.STRING(20), allowNull:false, field:'status'}
},{
  tableName:'solucaonaoencontrada',
  timestamps:false
});

//ASSOCIAÇÕES
Usuario.belongsToMany(Perfil,{through: PerfilUsuario, foreignKey:'id_usuario', otherKey:'id_perfil'});
Perfil.belongsToMany(Usuario, {through:PerfilUsuario, foreignKey:'id_perfil', otherKey:'id_usuario'});
Tema.hasMany(Assunto,{foreignKey:'id_tema'});
Assunto.belongsTo(Tema, {foreignKey:'id_tema'});
Assunto.hasMany(Documento,{foreignKey:'id_assunto'});
Documento.belongsTo(Assunto,{foreignKey:'id_assunto'});
Usuario.hasMany(Sessao,{foreignKey:'id_usuario'});
Sessao.belongsTo(Usuario, {foreignKey:'id_usuario'});
Sessao.hasMany(Consulta,{foreignKey:'id_sessao'});
Consulta.belongsTo(Sessao,{foreignKey:'id_sessao'});
Consulta.hasOne(Sugestao,{foreignKey:'id_consulta'});
Sugestao.belongsTo(Consulta,{foreignKey:'id_consulta'});
Consulta.hasOne(Feedback,{foreignKey:'id_consulta'});
Feedback.belongsTo(Consulta,{foreignKey:'id_consulta'});
Consulta.hasMany(Solucaonaoencontrada,{foreignKey:'id_consulta'});
Solucaonaoencontrada.belongsTo(Consulta,{foreignKey:'id_consulta'});

export async function syncAll() {
  await sequelize.sync({ alter: true });
  console.log('📦 Todos os modelos sincronizados.');
}
