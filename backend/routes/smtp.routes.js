import express from 'express';
import {
  createSmtpConfig,
  getSmtpConfigs,
  getSmtpConfigById,
  updateSmtpConfig,
  deleteSmtpConfig
} from '../controllers/smtp.controller.js';
import verifyToken from '../middlewares/verify.js';
import { requireOrgAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyToken);

router.post('/smtp', requireOrgAdmin, createSmtpConfig);
router.get('/smtp', getSmtpConfigs);
router.get('/smtp/:id', getSmtpConfigById);
router.put('/smtp/:id', requireOrgAdmin, updateSmtpConfig);
router.delete('/smtp/:id', requireOrgAdmin, deleteSmtpConfig);

export default router;
