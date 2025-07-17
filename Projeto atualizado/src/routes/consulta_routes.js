import express from 'express';
import { responderPergunta } from '../controllers/consultaController.js';

const router = express.Router();

router.post('/responder', responderPergunta);

export default router;
