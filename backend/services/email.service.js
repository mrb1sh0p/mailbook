import nodemailer from 'nodemailer';
import fs from 'fs';

export const createTransporter = (smtpConfig) => {
  return nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure === 'SSL',
    requireTLS: smtpConfig.secure === 'TLS',
    auth: {
      user: smtpConfig.username,
      pass: smtpConfig.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const sendSingleEmail = async (
  transporter,
  smtpConfig,
  emailData,
  html
) => {
  const mailOptions = {
    from: `"${smtpConfig.username.split('@')[0]}" <${smtpConfig.username}>`,
    to: emailData.to,
    subject: emailData.subject,
    html,
    headers: {
      'X-Priority': '1',
      'Reply-To': smtpConfig.username,
    },
    envelope: {
      from: smtpConfig.username,
      to: emailData.to,
    },
    attachments: [],
  };

  if (emailData.attachment) {
    mailOptions.attachments.push({
      filename: emailData.attachment.originalname,
      path: `uploads/${emailData.attachment.filename}`,
    });
  }

  const info = await transporter.sendMail(mailOptions);

  if (emailData.attachment) {
    fs.unlinkSync(`uploads/${emailData.attachment.filename}`);
  }

  return info;
};
