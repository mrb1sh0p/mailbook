import express from 'express';
import {
  createSmtpConfig,
  getSmtpConfigs,
  getSmtpConfigById,
} from '../controllers/smtp.controller.js';
import { uploadFile } from '../controllers/upload.controller.js';
import { sendEmails } from '../controllers/email.controller.js';

import {
  createEmailModel,
  getEmailModels,
  getEmailModelById,
  updateEmailModel,
  deleteEmailModel,
} from '../controllers/model.controller.js';

import { requireOrgAdmin } from '../middlewares/auth.js';
import verifyToken from '../middleware/verify.js';

const router = express.Router();

router.use(verifyToken);
// Rotas SMTP
router.post('/smtp', requireOrgAdmin, createSmtpConfig);
router.get('/smtp', getSmtpConfigs);
router.get('/smtp/:id', getSmtpConfigById);

// Upload de arquivo
router.post('/upload', uploadFile);

// Envio de e-mails
router.post('/send', sendEmails);

// Rotas de modelos
router.post('/model', createEmailModel);
router.get('/model', getEmailModels);
router.get('/model/:id', getEmailModelById);
router.put('/model/:id', updateEmailModel);
router.delete('/model/:id', deleteEmailModel);

export default router;
