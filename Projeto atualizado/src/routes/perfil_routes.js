import express from 'express';
import { createPerfil, updatePerfil, deletePerfil } from '../controllers/perfil_controller.js';

const router = express.Router();
//ROTAS DO CRUD
router.post('/', createPerfil);          // Criar perfil
router.put('/:id', updatePerfil);        // Editar perfil
router.delete('/:id', deletePerfil);     // Excluir perfil

export default router;
