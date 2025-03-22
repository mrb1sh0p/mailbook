import { useEffect, useState } from 'react';
import SMTPConfigPanel from './components/SMTPConfig/SMTPConfigPanel';
import EmailComposer from './components/EmailForm/EmailComposer';
import FeedbackMessage from './components/UI/FeedbackMessage';
import { useSMTP } from './hooks/useSMTP';
import { useEmail } from './hooks/useEmail';
import { useUser } from './hooks/useUser';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { getDataUser, loading } = useUser();
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [showSmtpConfig, setShowSmtpConfig] = useState(true);

  const {
    smtpList,
    selectedSmtp,
    error: smtpError,
    loading: smtpLoading,
    selectSMTP,
    saveSMTP,
    updateSMTP,
  } = useSMTP();

  const {
    emailData,
    loading: emailLoading,
    error: emailError,
    sendEmails,
    updateRecipient,
    handleFileUpload,
    addRecipient,
    removeRecipient,
    setEmailData,
  } = useEmail();

  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          const data = await getDataUser();
          if (data) setUser(data);
        } catch (error) {
          console.error('Erro ao buscar usuário:', error);
        }
      };
      fetchUser();
    }
  }, [getDataUser, user]);

  const handleSend = async () => {
    if (!selectedSmtp) {
      alert('Selecione uma configuração SMTP primeiro');
      return;
    }

    try {
      await sendEmails(selectedSmtp);
      setEmailData((prev) => ({
        ...prev,
        recipients: [{ to: '', subject: '', attachment: null }],
      }));
    } catch (error) {
      console.error('Erro no envio de e-mails:', error);
      alert('Falha no envio de e-mail. Verifique as configurações SMTP.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          {loading ? (
            <div>Carregando...</div>
          ) : (
            <div>
              <p>
                {user?.name || 'Usuário desconhecido'} -{' '}
                {user?.orgName || 'Sem organização'}
              </p>
            </div>
          )}
          <button onClick={logout}>Sair</button>
        </header>

        {(smtpError || emailError) && (
          <FeedbackMessage type="error" message={smtpError || emailError} />
        )}

        <SMTPConfigPanel
          configs={smtpList}
          selectedConfig={selectedSmtp}
          onSelect={selectSMTP}
          onSave={saveSMTP}
          onUpdate={updateSMTP}
          loading={smtpLoading}
          showConfig={showSmtpConfig}
          toggleShowConfig={() => setShowSmtpConfig((prev) => !prev)}
        />

        <EmailComposer
          emailData={emailData}
          onRecipientChange={updateRecipient}
          onFileUpload={handleFileUpload}
          onAddRecipient={addRecipient}
          onRemoveRecipient={removeRecipient}
          onSend={handleSend}
          onContentChange={(html) =>
            setEmailData((prev) => ({ ...prev, html }))
          }
          loading={emailLoading}
        />
      </div>
    </div>
  );
};

export default App;
