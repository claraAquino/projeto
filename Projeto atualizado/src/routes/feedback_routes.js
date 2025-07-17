import express from 'express';
import { criarFeedback } from '../controllers/feedback_controller.js';
const router = express.Router();

router.post('/:id_consulta', criarFeedback);
export default router;
