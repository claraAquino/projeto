import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js'; 

export const DocumentoParagrafoEmbedding = sequelize.define('DocumentoParagrafoEmbedding', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_documento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Documento,      // Referência direta ao modelo
      key: 'id_documento'
    },
    onDelete: 'CASCADE'
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  embedding: {
    type: DataTypes.JSONB,
    allowNull: false
  }
}, {
  tableName: 'documento_paragrafo_embedding',
  schema: 'queroquero',
  timestamps: false
});
