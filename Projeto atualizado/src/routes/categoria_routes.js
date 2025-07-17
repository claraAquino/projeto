import express from 'express';
import {
  criarCategoria,
  listarCategoria,
  atualizarCategoria,
  deletarCategoria
} from '../controllers/categoria_controller.js';
import { autenticar } from '../middlewares/auth.js';

const router = express.Router();

// Protegidas por autenticação
router.post('/', autenticar, criarCategoria);
router.get('/', autenticar, listarCategoria);
router.put('/:id', autenticar, atualizarCategoria);
router.delete('/:id', autenticar, deletarCategoria);

export default router;
