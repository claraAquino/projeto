import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Feedback = sequelize.define('Feedback', {
  id_feedback:  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_feedback' },
  id_consulta:  { type: DataTypes.INTEGER, allowNull: false, unique: true, field: 'id_consulta' },
  util:         { type: DataTypes.BOOLEAN, allowNull: false, field: 'util' },
  data_feedback:{ type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'data_feedback' }
}, {
  tableName: 'feedback',
  schema:    'queroquero',
  timestamps: false
});
