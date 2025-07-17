import express from 'express';
import {
  criarSubcategoria,
  listarSubcategoria,
  atualizarSubcategoria,
  deletarSubcategoria
} from '../controllers/subcategoria_controller.js';
import { autenticar } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', autenticar, criarSubcategoria);
router.get('/', autenticar, listarSubcategoria);
router.put('/:id', autenticar, atualizarSubcategoria);
router.delete('/:id', autenticar, deletarSubcategoria);

export default router;
