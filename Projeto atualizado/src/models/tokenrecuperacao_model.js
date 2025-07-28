import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Usuario } from './usuario_model.js';

export const TokenRecuperacao = sequelize.define('TokenRecuperacao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiracao: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'token_recuperacao',
  timestamps: false
});

TokenRecuperacao.belongsTo(Usuario, { foreignKey: 'id_usuario' });
