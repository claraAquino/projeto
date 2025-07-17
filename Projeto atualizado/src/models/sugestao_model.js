import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js'; 

export const Sugestao = sequelize.define('Sugestao', {
  id_sugestao: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id_sugestao' },
  id_consulta: { type: DataTypes.INTEGER, allowNull: false, unique: true, field: 'id_consulta' },
  solucao:     { type: DataTypes.TEXT, allowNull: false, field: 'solucao' },
  id_documento:{ type: DataTypes.INTEGER, field: 'id_documento' },
  data_sugestao:{ type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'data_sugestao' }
}, {
  tableName: 'sugestao',
  schema:    'queroquero',
  timestamps: false
});
