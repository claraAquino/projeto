import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Sugestao = sequelize.define('Sugestao', {
  id_sugestao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_sugestao'
  },
  id_consulta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_consulta'
  },
  id_documento: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_documento'
  },
  solucao: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'solucao'
  },
  data_sugestao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'data_sugestao'
  },
  avaliacoes_positivas: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'avaliacoes_positivas'
  },
  avaliacoes_negativas: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'avaliacoes_negativas'
  }
}, {
  tableName: 'sugestao',
  schema: 'schema',
  timestamps: false
});
