import express from 'express';
import { atribuirPerfilAoUsuario, removerPerfil } from '../controllers/perfilUsuario_controller.js';

const router = express.Router();


router.delete('/:id_usuario/remove-perfil', removerPerfil);

export default router;
