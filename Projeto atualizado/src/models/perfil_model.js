import {DataTypes} from 'sequelize';
import {sequelize} from '../config/database.js';


export const Perfil = sequelize.define('Perfil', {
    id_perfil: {
        type : DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        field: 'id_perfil'
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull:false,
        field:'nome'
    },
    tipo: {
        type: DataTypes.TEXT,
        field:'tipo'
    }
}, {
    tableName: 'perfil',
    schema: 'schema',
    timestamps: false
});
