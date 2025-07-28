import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Sugestao } from './sugestao_model.js';

export const Feedback = sequelize.define('Feedback', {
  id_feedback:  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_feedback' },
  id_sugestao:  { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    field: 'id_sugestao',
    unique: true, 
    references: { model: Sugestao, key: 'id_sugestao' }
  },
  util:         { type: DataTypes.BOOLEAN, allowNull: false, field: 'util' },
  data_feedback:{ type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'data_feedback' }
}, {
  tableName: 'feedback',
  schema:    'schema',
  timestamps: false
});
