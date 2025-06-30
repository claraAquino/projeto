import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const PerfilUsuario = sequelize.define('PerfilUsuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'usuario',
      key: 'id_usuario'
    }
  },
  id_perfil: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'perfil',
      key: 'id_perfil'
    }
  }
}, {
  tableName: 'perfil_usuario',
  schema: 'queroquero',
  timestamps: false
});