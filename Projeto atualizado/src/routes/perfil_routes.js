import express from 'express';
import { getPerfis, createPerfil, updatePerfil, deletePerfil } from '../controllers/perfil_controller.js';

const router = express.Router();

router.get('/', getPerfis);       // Listar perfis
router.post('/', createPerfil);   // Criar perfil
router.put('/:id', updatePerfil); // Atualizar perfil
router.delete('/:id', deletePerfil); // Deletar perfil

export default router;
