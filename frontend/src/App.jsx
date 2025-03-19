import { useState } from 'react';
import SMTPConfigPanel from './components/SMTPConfig/SMTPConfigPanel';
import EmailComposer from './components/EmailForm/EmailComposer';
import FeedbackMessage from './components/UI/FeedbackMessage';
import { useSMTP } from './hooks/useSMTP';
import { useEmail } from './hooks/useEmail';

const App = () => {
  const [showSmtpConfig, setShowSmtpConfig] = useState(true);
  const {
    smtpList,
    selectedSmtp,
    saveSMTPConfig,
    selectSMTPConfig,
    loading: smtpLoading,
    error: smtpError,
    deleteSMTPConfig,
    updateSMTPConfig,
    resetSelectedConfig
  } = useSMTP();

  const {
    emailData,
    sendEmails,
    loading: emailLoading,
    error: emailError,
    updateRecipient,
    handleFileUpload,
    addRecipient,
    removeRecipient,
    setEmailData
  } = useEmail();

  const handleSend = async () => {
    if (!selectedSmtp) {
      alert('Selecione uma configuração SMTP primeiro');
      return;
    }
    
    try {
      await sendEmails(selectedSmtp);
      setEmailData(prev => ({
        ...prev,
        recipients: [{ to: '', subject: '', attachment: null }]
      }));
    } catch (error) {
      console.error('Falha no envio:', error);
    }
  };

  const handleSaveConfig = async (config) => {
    try {
      const savedConfig = await saveSMTPConfig(config);
      if (config.id) {
        updateSMTPConfig(savedConfig);
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <FeedbackMessage 
          type={smtpError ? 'error' : emailError ? 'error' : 'success'} 
          message={smtpError || emailError} 
        />

        <SMTPConfigPanel
          configs={smtpList}
          selectedConfig={selectedSmtp}
          onSave={handleSaveConfig}
          onSelect={selectSMTPConfig}
          resetSelectedConfig={resetSelectedConfig}
          onDelete={deleteSMTPConfig}
          loading={smtpLoading}
          showConfig={showSmtpConfig}
          toggleShowConfig={() => setShowSmtpConfig(!showSmtpConfig)}
        />

        <EmailComposer
          emailData={emailData}
          onRecipientChange={updateRecipient}
          onFileUpload={handleFileUpload}
          onAddRecipient={addRecipient}
          onRemoveRecipient={removeRecipient}
          onSend={handleSend}
          onContentChange={(html) => setEmailData(prev => ({ ...prev, html }))} 
          loading={emailLoading}
        />
      </div>
    </div>
  );
};

export default App;