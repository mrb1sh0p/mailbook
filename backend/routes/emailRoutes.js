import express from 'express';
import nodemailer from 'nodemailer';
import { pool } from '../db.js';

const router = express.Router();

// Salvar configuração SMTP
router.post('/smtp', async (req, res) => {
  const { host, port, secure, user, pass } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO smtp_config (host, port, secure, user, pass) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [host, port, secure, user, pass]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enviar e-mails
router.post('/send', async (req, res) => {
  const { to, subject, html, smtpConfig } = req.body;
  
  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass
    }
  });

  try {
    const results = await Promise.all(
      to.split(',').map(email => 
        transporter.sendMail({
          from: `"${smtpConfig.user}" <${smtpConfig.user}>`,
          to: email.trim(),
          subject,
          html
        })
      )
    );
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;