import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

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
