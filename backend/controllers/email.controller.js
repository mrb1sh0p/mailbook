import {
  createTransporter,
  sendSingleEmail,
} from '../services/email.service.js';

export const sendEmails = async (req, res) => {
  const { emails, html, smtpConfig } = req.body;

  try {
    const transporter = createTransporter(smtpConfig);
    await transporter.verify();

    const results = await Promise.all(
      emails.map(async (emailData) => {
        try {
          return await sendSingleEmail(
            transporter,
            smtpConfig,
            emailData,
            html
          );
        } catch (error) {
          return {
            error: error.message,
            email: emailData.to,
            subject: emailData.subject,
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      sentCount: results.filter((r) => !r.error).length,
      failedCount: results.filter((r) => r.error).length,
      results,
    });
  } catch (error) {
    console.error('Erro no envio:', error);
    res.status(500).json({
      error: 'Erro ao enviar e-mails',
      details: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }
};
