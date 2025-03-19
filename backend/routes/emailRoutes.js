import express from 'express';
import {
  createSmtpConfig,
  getSmtpConfigs,
  getSmtpConfigById
} from '../controllers/smtpController.js';
import { uploadFile } from '../controllers/uploadController.js';
import { sendEmails } from '../controllers/emailController.js';

import {
  createEmailModel,
  getEmailModels,
  getEmailModelById,
  updateEmailModel,
  deleteEmailModel
} from '../controllers/modelController.js';


const router = express.Router();

// Rotas SMTP
router.post('/smtp', createSmtpConfig);
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