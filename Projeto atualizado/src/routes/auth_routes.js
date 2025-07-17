import { Router } from 'express';
import { loginUser } from '../controllers/user_controller.js';
import { validarSessao } from '../middlewares/auth.js';


const router = Router();

router.post('/login', loginUser);
router.get('/validar', validarSessao);


export default router;
