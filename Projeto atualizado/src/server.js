// src/server.js
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';          
import { testConnection } from './config/database.js';

const PORT = process.env.PORT || 3000;

(async () => {
  // 1) Testa a conexão com o banco
  await testConnection();

  // 2) Inicia o servidor Express
  app.listen(PORT, () => {
    console.log(`🚀 Server rodando em http://localhost:${PORT}`);
  });
})();
