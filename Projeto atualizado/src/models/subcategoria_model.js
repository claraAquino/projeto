// src/models/assunto.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const Subcategoria = sequelize.define('Subcategoria', {
  id_subcategoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'subcategoria',
  schema: 'schema',
  timestamps: false,
});


