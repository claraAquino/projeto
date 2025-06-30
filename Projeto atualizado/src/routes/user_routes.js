import { Router } from 'express';
import { createUser, updateUser, deleteUser } from '../controllers/user_controller.js';

const router = Router();
//ROTAS DO CRUD
router.post('/', createUser);      // Criar usuário
router.put('/:id', updateUser);    // Atualizar usuário
router.delete('/:id', deleteUser); // Excluir usuário

export default router;