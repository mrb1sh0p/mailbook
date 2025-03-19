import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

function App() {
  const [smtpList, setSmtpList] = useState([]);
  const [selectedSmtpId, setSelectedSmtpId] = useState('');
  const [smtp, setSmtp] = useState({
    title: '',
    host: '',
    port: 587,
    secure: 'TLS',
    username: '',
    pass: ''
  });
  const [encryptionType, setEncryptionType] = useState('tls');
  const [emailData, setEmailData] = useState({
    html: '<h1 class="text-2xl font-bold">Conteúdo do E-mail</h1>',
    recipients: [
      { to: '', subject: '', attachment: null }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [showSmtpConfig, setShowSmtpConfig] = useState(true);

  // Carregar configurações SMTP
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        const { data } = await axios.get('/api/v1/smtp');
        if(data){
          setSmtpList(data);
        }
      } catch (error) {
        showFeedback('error', 'Erro ao carregar configurações');
      }
    };
    loadConfigs();
  }, []);

  // Manipuladores de SMTP
  const handleSmtpChange = (e) => {
    const { name, value } = e.target;
    setSmtp(prev => ({ ...prev, [name]: value }));
  };

  const handleEncryptionChange = (e) => {
    const type = e.target.value;
    setEncryptionType(type);
    const newPort = type === 'ssl' ? 465 : 587;
    setSmtp(prev => ({
      ...prev,
      secure: type === 'ssl' ? 'SSL' : 'TLS',
      port: newPort
    }));
  };

  const saveSmtpConfig = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/v1/smtp', smtp);
      console.log(data);
      setSmtpList([...smtpList, data]);
      showFeedback('success', 'Configuração salva com sucesso!');
    } catch (error) {
      console.log(error);
      showFeedback('error', 'Erro ao salvar configuração');
    }
  };

  // Carregar configuração selecionada
  const loadSelectedSmtp = async (id) => {
    try {
      const { data } = await axios.get(`/api/v1/smtp/${id}`);
      setSmtp(data);
      setEncryptionType(data.secure === 'ssl' ? 'ssl' : 'tls');
      setSelectedSmtpId(id);
    } catch (error) {
      showFeedback('error', 'Erro ao carregar configuração SMTP');
    }
  };

  // Manipuladores de E-mails
  const updateRecipient = (index, field, value) => {
    const updated = [...emailData.recipients];
    updated[index][field] = value;
    setEmailData({ ...emailData, recipients: updated });
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await axios.post('/api/v1/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateRecipient(index, 'attachment', data);
    } catch (error) {
      showFeedback('error', 'Falha no upload do arquivo');
    }
  };

  const addRecipient = () => {
    setEmailData(prev => ({
      ...prev,
      recipients: [...prev.recipients, { to: '', subject: '', attachment: null }]
    }));
  };

  const removeRecipient = (indexToRemove) => {
    if (emailData.recipients.length === 1) return;
    setEmailData(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Envio de e-mails
  const sendEmails = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        emails: emailData.recipients,
        html: emailData.html,
        smtpConfig: smtp
      };

      const { data } = await axios.post('/api/v1/send', payload);
      
      if (data.success) {
        showFeedback('success', `${data.sentCount} e-mails enviados com sucesso!`);
      } else {
        showFeedback('warning', 'Alguns e-mails não foram enviados');
      }

      setEmailData({
        html: emailData.html,
        recipients: [{ to: '', subject: '', attachment: null }]
      });
    } catch (error) {
      let message = 'Erro desconhecido';
      if (error.response) {
        message = `${error.response.data.error}: ${error.response.data.details}`;
      } else if (error.request) {
        message = 'Sem resposta do servidor - verifique sua conexão';
      } else {
        message = error.message;
      }
      showFeedback('error', message);
    } finally {
      setLoading(false);
    }
  };

  // Feedback visual
  const showFeedback = (type, message, error) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Feedback */}
        {feedback.message && (
          <div className={`p-4 rounded-lg ${
            feedback.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : feedback.type === 'warning'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {feedback.message}
          </div>
        )}

        {/* Seção SMTP recolhível */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowSmtpConfig(!showSmtpConfig)}
          >
            <h2 className="text-2xl font-bold text-gray-800">Configuração SMTP</h2>
            {showSmtpConfig ? (
              <ChevronUpIcon className="h-6 w-6 text-gray-600" />
            ) : (
              <ChevronDownIcon className="h-6 w-6 text-gray-600" />
            )}
          </div>

          {showSmtpConfig && (
            <form onSubmit={saveSmtpConfig} className="mt-6">
              <div className="mb-4">
                <label className="block mb-2 font-medium">Selecionar Configuração:</label>
                <select 
                  className="border p-2 rounded w-full"
                  onChange={(e) => loadSelectedSmtp(e.target.value)}
                  value={selectedSmtpId}
                >
                  <option value="">Nova Configuração</option>
                  {smtpList.map((config) => (
                    <option key={config.id} value={config.id}>
                      {config.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Titulo</label>
                  <input
                    name="title"
                    value={smtp.title}
                    onChange={handleSmtpChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Título da configuração"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Host SMTP</label>
                  <input
                    name="host"
                    value={smtp.host}
                    onChange={handleSmtpChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="smtp.seuprovedor.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tipo de Criptografia</label>
                  <select
                    value={encryptionType}
                    onChange={handleEncryptionChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="tls">TLS (Recomendado)</option>
                    <option value="ssl">SSL</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Porta</label>
                  <input
                    type="number"
                    name="port"
                    value={smtp.port}
                    onChange={handleSmtpChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Usuário</label>
                  <input
                    name="username"
                    value={smtp.username}
                    onChange={handleSmtpChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Senha</label>
                  <input
                    type="password"
                    name="pass"
                    value={smtp.pass}
                    onChange={handleSmtpChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="text-sm text-gray-500 mt-2">
                {encryptionType === 'ssl' ? (
                  <span>✔️ Conexão segura via SSL na porta {smtp.port}</span>
                ) : (
                  <span>✔️ Conexão segura via TLS (STARTTLS) na porta {smtp.port}</span>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {selectedSmtpId ? 'Atualizar Configuração' : 'Salvar Configuração'}
              </button>
            </form>
          )}
        </div>

        {/* Seção de Envio */}
        <form onSubmit={sendEmails} className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Enviar E-mails</h2>
          
          {emailData.recipients.map((recipient, index) => (
            <div key={index} className="mb-6 border-b pb-6 last:border-b-0 relative group">
              <button
                type="button"
                onClick={() => removeRecipient(index)}
                className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                disabled={emailData.recipients.length === 1}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Destinatário</label>
                  <input
                    type="email"
                    value={recipient.to}
                    onChange={(e) => updateRecipient(index, 'to', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="destinatario@exemplo.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Assunto</label>
                  <input
                    value={recipient.subject}
                    onChange={(e) => updateRecipient(index, 'subject', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Assunto do e-mail"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Anexo PDF</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(index, e.target.files[0])}
                  className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {recipient.attachment && (
                  <div className="mt-2 text-sm text-gray-500 flex items-center">
                    <span className="mr-2">📎 {recipient.attachment.originalname}</span>
                    <span className="text-xs">({Math.round(recipient.attachment.size / 1024)} KB)</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <button
              type="button"
              onClick={addRecipient}
              className="bg-blue-100 text-blue-700 py-2 px-4 rounded-md hover:bg-blue-200 transition-colors"
            >
              + Adicionar Destinatário
            </button>

            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex-1"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Enviando...
                </span>
              ) : (
                `Enviar ${emailData.recipients.length} E-mail(s)`
              )}
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conteúdo HTML</label>
            <textarea
              value={emailData.html}
              onChange={(e) => setEmailData({ ...emailData, html: e.target.value })}
              className="w-full h-96 p-4 border rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 resize-none"
              spellCheck="false"
              placeholder="Digite seu conteúdo HTML aqui..."
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;