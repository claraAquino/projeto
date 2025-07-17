import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

  const CodigoRecuperacao = sequelize.define('CodigoRecuperacao', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'id'
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_usuario',
      references: {
        model: 'usuario',
        key: 'id_usuario'
      }
    },
    codigo: {
      type: DataTypes.STRING(6),
      allowNull: false,
      field: 'codigo'
    },
    expiracao: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expiracao'
    },
    usado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'usado'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'createdAt'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updatedAt'
    }
  }, {
    tableName: 'codigo_recuperacao',
    schema: 'queroquero',
    timestamps: true
  });
