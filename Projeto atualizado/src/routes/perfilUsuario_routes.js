import express from 'express';
import {
  vincularPerfil,
  listarVinculos,
  desvincularPerfil
} from '../controllers/perfilUsuario_controller.js';

const router = express.Router();

router.post('/', vincularPerfil);
router.get('/', listarVinculos);
router.delete('/:id_usuario/:id_perfil', desvincularPerfil);

export default router;
