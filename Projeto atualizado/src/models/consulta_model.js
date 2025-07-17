import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const Consulta = sequelize.define('Consulta', {
  id_consulta:  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_consulta' },
  id_sessao:    { type: DataTypes.INTEGER, allowNull: false, field: 'id_sessao' },
  input:        { type: DataTypes.TEXT, allowNull: false, field: 'input' },
  data_consulta:{ type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'data_consulta' }
}, {
  tableName: 'consulta',
  schema:    'queroquero',
  timestamps: false
});
