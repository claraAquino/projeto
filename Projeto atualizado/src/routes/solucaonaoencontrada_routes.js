import express from 'express';
import { listarSolucoesNaoEncontradas } from '../controllers/solucaonaoencontrada_controller.js';

const router = express.Router();

router.get('/', listarSolucoesNaoEncontradas);

export default router;
