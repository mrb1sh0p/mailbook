import express from 'express';
import { Login, LoginOverlord } from '../controllers/access.controller.js';

const router = express.Router();

router.post('/login', Login);
router.post('/login-overlord', LoginOverlord);

export default router;
