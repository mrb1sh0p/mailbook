import express from 'express';
import nodemailer from 'nodemailer';
import { pool } from '../db.js';
import { upload } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// CRUD SMTP
router.post('/smtp', async (req, res) => {
  const { host, port, secure, user, pass } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO smtp_config 
      (title, host, port, secure, username, pass) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [title, host, port, secure, user, pass]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/smtp', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM smtp_config');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/smtp/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM smtp_config WHERE id = $1', [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload de arquivo
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  
  res.json({ 
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size
  });
});

// Envio de e-mails
router.post('/send', async (req, res) => {
  const { emails, html, smtpConfig } = req.body;
  
  // Validação básica
  if (!emails || !html || !smtpConfig) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  console.log(emails)

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    requireTLS: true,
    auth: {
      user: smtpConfig.username,
      pass: smtpConfig.pass
    }
  });

  //verificando se o smtp é valido
  transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

  try {
    const results = await Promise.all(
      emails.map(async (emailData) => {
        const mailOptions = {
          from: `"${smtpConfig.user}" <${smtpConfig.user}>`,
          to: emailData.to,
          subject: emailData.subject,
          html: html,
          attachments: []
        };

        // Adicionar anexo se existir
        if (emailData.attachment) {
          const filePath = path.join('uploads', emailData.attachment.filename);
          mailOptions.attachments.push({
            filename: emailData.attachment.originalname,
            path: filePath,
            contentType: 'application/pdf'
          });
        }

        const info = await transporter.sendMail(mailOptions);
        
        // Limpar arquivo após envio
        if (emailData.attachment) {
          fs.unlinkSync(path.join('uploads', emailData.attachment.filename));
        }

        return info;
      })
    );

    res.json({ 
      success: true, 
      sentCount: results.length,
      results 
    });
  } catch (error) {
    console.error('Erro no envio:', error);
    res.status(500).json({ 
      error: 'Erro ao enviar e-mails',
      details: error.message 
    });
  }
});

export default router;