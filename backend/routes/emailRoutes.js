import express from 'express';
import nodemailer from 'nodemailer';
import { pool } from '../db.js';
import { upload } from '../middleware/upload.js';
import fs from 'fs';

const router = express.Router();

// CRUD SMTP
router.post('/smtp', async (req, res) => {
  const { title, host, port, secure, username, pass } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO smtp_config 
      (title, host, port, secure, username, pass) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [title, host, port, secure, username, pass]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro no banco de dados:', error);
    res.status(500).json({ 
      error: 'Erro ao salvar configuração',
      details: error.message
    });
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

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure === "SSL", 
    requireTLS: smtpConfig.secure === "TLS",
    auth: {
      user: smtpConfig.username,
      pass: smtpConfig.pass
    }
  });

  try {
    console.log('Verificando conexão SMTP...');
    await transporter.verify();
    console.log('Conexão SMTP verificada com sucesso!');

    const results = await Promise.all(
      emails.map(async (emailData) => {
        console.log('Preparando e-mail para:', emailData.to);

        if (!emailData.to || !emailData.subject) {
          return { error: 'E-mail ou assunto não informados' };
        }

        const mailOptions = {
          from: `'${smtpConfig.username.split('@')[0]}' <${smtpConfig.username}>`,
          to: emailData.to,
          subject: emailData.subject,
          html,
          headers:{
            'X-Priority': '1',
            'Reply-To': smtpConfig.username
          },
          attachments: [],
          envelope: {
            from: smtpConfig.username,
            to: emailData.to
          }
        };

        if (emailData.attachment) {
          console.log('Adicionando anexo:', emailData.attachment.originalname);
          mailOptions.attachments.push({
            filename: emailData.attachment.originalname,
            path: `uploads/${emailData.attachment.filename}`,
          });
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado:', {
          messageId: info.messageId,
          to: info.envelope.to,
          subject: emailData.subject
        });
        
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