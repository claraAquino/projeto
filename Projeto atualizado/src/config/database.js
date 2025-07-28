import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {},
    define: {
      schema: 'schema',
    },
    searchPath: 'schema',
  }
);

await sequelize.sync({ alter: true, searchPath: 'schema' });


export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✔️ Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
    process.exit(1);
  }
}
