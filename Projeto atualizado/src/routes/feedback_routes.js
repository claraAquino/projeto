import express from 'express';
import { registrarFeedback } from '../controllers/feedback_controller.js';

const router = express.Router();

router.post('/', registrarFeedback);


export default router;
