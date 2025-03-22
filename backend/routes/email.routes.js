import express from 'express';

import { uploadFile } from '../controllers/upload.controller.js';
import { sendEmails } from '../controllers/email.controller.js';

import {
  createEmailModel,
  getEmailModels,
  getEmailModelById,
  updateEmailModel,
  deleteEmailModel,
} from '../controllers/model.controller.js';

import verifyToken from '../middlewares/verify.js';

const router = express.Router();

router.use(verifyToken);

router.post('/upload', uploadFile);

router.post('/send', sendEmails);

router.post('/model', createEmailModel);
router.get('/model', getEmailModels);
router.get('/model/:id', getEmailModelById);
router.put('/model/:id', updateEmailModel);
router.delete('/model/:id', deleteEmailModel);

export default router;
