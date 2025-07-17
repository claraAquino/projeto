import express from 'express';
import { 
  createUserByAdm, 
  updateUser, 
  deleteUser, 
  atribuirPerfilAoUsuario, 
  getUsers, 
  loginUser, 
  getUsuarioPorEmail,
  toggleStatusUsuario  // vamos criar essa função no controller
} from '../controllers/user_controller.js';

import { autenticar } from '../middlewares/auth.js';
const router = express.Router();

router.post('/', createUserByAdm);          // criação via admin
router.put('/:id', updateUser);             // Atualizar usuário
router.delete('/:id', deleteUser);          // Excluir usuário
router.get('/', getUsers);                   // Listar usuários

router.put('/:id_usuario/atribuir-perfil', atribuirPerfilAoUsuario);

//rota para toggle status ativo/inativo
router.patch('/:id_usuario/status', autenticar, toggleStatusUsuario);

router.get('/email/:email', autenticar, getUsuarioPorEmail);
router.post('/login', loginUser);           // Login

export default router;
