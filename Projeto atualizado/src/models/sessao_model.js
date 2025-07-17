
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';


export const Sessao = sequelize.define('Sessao', {
  id_sessao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_sessao'
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario'
  },
  data_hora_login: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'data_hora_login'
  },
  data_hora_logout: {
    type: DataTypes.DATE,
    allowNull: true, // logout pode estar em aberto
    field: 'data_hora_logout'
  },
  ultimo_acesso: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'ultimo_acesso'
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'token'
  }
}, {
  tableName: 'sessao',
  schema: 'queroquero',
  timestamps: false
});
