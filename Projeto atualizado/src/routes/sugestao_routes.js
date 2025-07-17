import express from 'express';
import { criarSugestao } from '../controllers/sugestao_controller.js';

const router = express.Router();

router.post('/', criarSugestao);

export default router;
