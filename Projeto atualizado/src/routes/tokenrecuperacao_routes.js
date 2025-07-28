import express from 'express';
import { solicitarRecuperacao, redefinirSenha } from '../controllers/tokenrecuperacao_controller.js';

const router = express.Router();

router.post('/recuperar-senha', solicitarRecuperacao);
router.post('/redefinir-senha', redefinirSenha);

export default router;
