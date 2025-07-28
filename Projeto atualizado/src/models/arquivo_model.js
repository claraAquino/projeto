// src/models/documento.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Documento = sequelize.define('Documento', {
  id_documento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  arquivo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  id_subcategoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },  

  obsoleto: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'obsoleto'
  },
  data_criacao:    { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW, 
    field: 'data_criacao' 
  },
  tipo:{            
    type: DataTypes.STRING(50), 
    field: 'tipo'
  },

  obsoleto:{
    type:DataTypes.BOOLEAN, 
    field:'obsoleto'
  }
}, {
  tableName: 'documento',
  schema: 'schema',
  timestamps: false,
});

export default Documento;
