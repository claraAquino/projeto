import express from 'express';
const router = express.Router(); // 👈 Agora `router` está definido

import { criarConsulta } from '../controllers/consulta_controller.js';

// Criar nova consulta
router.post('/', criarConsulta);

export default router;
