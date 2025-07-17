import express from 'express';
import { registrar, aprovar } from '../controllers/solucaonaoencontrada_controller.js';

const router = express.Router();

router.post('/', registrar);
router.put('/:id/aprovar', aprovar);

export default router;
