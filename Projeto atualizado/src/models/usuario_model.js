import {DataTypes} from 'sequelize';
import {sequelize} from '../config/database.js';


export const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(90),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  senha_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
   },
  data_cadastro:{
    type: DataTypes.DATE,
    defaultValue:DataTypes.NOW
  }
  
  
}, {
  tableName: 'usuario',
  schema: 'schema',
  timestamps: false
});

