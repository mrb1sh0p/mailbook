import { useState } from 'react';
import axios from 'axios';

export const useEmail = () => {
  const [emailData, setEmailData] = useState({
    html: '<p style="margin: 0cm; font-size: 11pt; font-family: calibri, sans-serif;" class="MsoNormal"><span style="background-color: rgb(255, 255, 255);"><strong>&nbsp;João Gustavo Soares Bispo</strong>&nbsp;| Assessor Técnico</span></p><p style="margin: 0cm; font-size: 11pt; font-family: calibri, sans-serif;" class="MsoNormal"><span style="background-color: rgb(255, 255, 255);"><span style="font-size: 12pt;">&nbsp;Instituto Estadual de Proteção ao Consumidor - PROCON</span>&nbsp;– PROCON/ES&nbsp;</span></p><p style="margin: 0cm; font-family: arial, helvetica, sans-serif;  class="MsoNormal"><span style="background-color: rgb(255, 255, 255);"><span style="font-family: calibri, sans-serif; font-size: 11pt;">GTI | NUINF – Núcleo de&nbsp;</span><span style="font-size: 14.6667px;">Informática</p>',
    recipients: [{ to: '', subject: '', attachment: null }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRecipient = (index, field, value) => {
    const updated = [...emailData.recipients];
    updated[index][field] = value;
    setEmailData(prev => ({ ...prev, recipients: updated }));
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await axios.post('/api/v1/upload', formData);
      updateRecipient(index, 'attachment', data);
    } catch (err) {
      setError('Falha no upload do arquivo');
    }
  };

  const sendEmails = async (smtpConfig) => {
    setLoading(true);
    try {
      const payload = {
        emails: emailData.recipients,
        html: emailData.html,
        smtpConfig
      };
      
      const { data } = await axios.post('/api/v1/send', payload);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao enviar e-mails');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addRecipient = () => {
    setEmailData(prev => ({
      ...prev,
      recipients: [...prev.recipients, { to: '', subject: '', attachment: null }]
    }));
  };

  const removeRecipient = (index) => {
    setEmailData(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index
      )
    }));
  };

  return {
    emailData,
    loading,
    error,
    addRecipient,
    removeRecipient,
    updateRecipient,
    handleFileUpload,
    sendEmails,
    setEmailData
  };
};