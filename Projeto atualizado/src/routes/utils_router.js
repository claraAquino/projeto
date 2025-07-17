import express from 'express';
import {
  enviarCodigo,
  verificarCodigo,
  redefinirSenha
} from '../controllers/utils_controller.js';

const router = express.Router();

router.post('/utils/enviar-codigo', enviarCodigo);
router.post('/utils/verificar-codigo', verificarCodigo);
router.post('/utils/redefinir-senha', redefinirSenha);

export default router;
