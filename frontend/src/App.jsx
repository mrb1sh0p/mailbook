import { useEffect, useState } from 'react';
import SMTPConfigPanel from './components/SMTPConfig/SMTPConfigPanel';
import EmailComposer from './components/EmailForm/EmailComposer';
import FeedbackMessage from './components/UI/FeedbackMessage';
import DarkModeToggle from './components/DarkModeToggle';
import { useSMTP } from './hooks/useSMTP';
import { useEmail } from './hooks/useEmail';
import { useUser } from './hooks/useUser';
import { useAuth } from './contexts/AuthContext';
import {
  FaCogs,
  FaEnvelope,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

const App = () => {
  const { getDataUser, loading } = useUser();
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState('email'); // Define a página padrão
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

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

  const combinedError = smtpError || emailError;

  const renderContent = () => {
    switch (activeMenu) {
      case 'smtp':
        return (
          <SMTPConfigPanel
            configs={smtpList}
            selectedConfig={selectedSmtp}
            onSelect={selectSMTP}
            onSave={saveSMTP}
            onUpdate={updateSMTP}
            loading={smtpLoading}
          />
        );
      case 'email':
        return (
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
        );
      default:
        return <div>Selecione uma opção no menu</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900 dark:bg-gray-900 dark:text-white">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-white shadow-md p-4 transition-all duration-300 flex flex-col justify-between relative dark:bg-gray-800`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-[-12px] bg-blue-500 text-white rounded-full p-1 shadow-md "
        >
          {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
        <div>
          {sidebarOpen && <h2 className="text-xl font-bold mb-4">Menu</h2>}
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveMenu('smtp')}
                className={`w-full flex items-center gap-2 p-2 rounded dark:text-white ${
                  activeMenu === 'smtp'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 text-gray-900 dark:hover:bg-gray-600'
                }`}
              >
                <FaCogs />
                {sidebarOpen && 'SMTP Config'}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('email')}
                className={`w-full flex items-center gap-2 p-2 rounded dark:text-white ${
                  activeMenu === 'email'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 text-gray-900 dark:hover:bg-gray-600'
                }`}
              >
                <FaEnvelope />
                {sidebarOpen && 'Email Composer'}
              </button>
            </li>
          </ul>
        </div>
        <div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            <FaSignOutAlt />
            {sidebarOpen && 'Sair'}
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            {loading && !user ? (
              <div>Carregando...</div>
            ) : (
              <p>
                {user?.name || 'Usuário desconhecido'} -{' '}
                {user?.org_name || 'Sem organização'} - ({user?.role})
              </p>
            )}
          </div>
          <DarkModeToggle />
        </header>
        {combinedError && (
          <FeedbackMessage type="error" message={combinedError} />
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
