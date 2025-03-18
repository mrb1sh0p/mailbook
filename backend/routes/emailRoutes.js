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
  
  console.log('Iniciando processo de envio...');
  console.log('Configuração SMTP:', JSON.stringify(smtpConfig, null, 2));

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass
    },
    logger: true,
    debug: true
  });

  try {
    console.log('Verificando conexão SMTP...');
    await transporter.verify();
    console.log('Conexão SMTP verificada com sucesso!');

    const results = await Promise.all(
      emails.map(async (emailData) => {
        console.log('Preparando e-mail para:', emailData.to);
        const mailOptions = {
          from: `"${smtpConfig.user}" <${smtpConfig.user}>`,
          to: emailData.to,
          subject: emailData.subject,
          html,
          attachments: []
        };

        if (emailData.attachment) {
          console.log('Adicionando anexo:', emailData.attachment.originalname);
          mailOptions.attachments.push({
            filename: emailData.attachment.originalname,
            path: `uploads/${emailData.attachment.filename}`,
            contentType: 'application/pdf'
          });
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado:', info.messageId);
        
        if (emailData.attachment) {
          fs.unlinkSync(`uploads/${emailData.attachment.filename}`);
          console.log('Arquivo temporário removido');
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
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;