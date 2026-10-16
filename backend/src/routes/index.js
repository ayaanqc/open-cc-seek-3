import { Router } from 'express';
import contactController from '../controllers/contact.controller.js';

const router = Router();

router.get('/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

router.post('/contact', contactController.create);

export default router;
