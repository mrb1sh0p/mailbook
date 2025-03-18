import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [smtpList, setSmtpList] = useState([]);
  const [selectedSmtpId, setSelectedSmtpId] = useState('');
  const [smtp, setSmtp] = useState({
    host: '',
    port: 587,
    secure: false,
    username: '',
    pass: ''
  });
  
  const [emailData, setEmailData] = useState({
    html: '<h1 class="text-2xl font-bold">Conteúdo do E-mail</h1>',
    recipients: [
      { to: '', subject: '', attachment: null }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Carregar configurações SMTP
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        const { data } = await axios.get('/api/v1/smtp/');
        setSmtpList(data);
      } catch (error) {
        showFeedback('error', 'Erro ao carregar configurações');
      }
    };
    loadConfigs();
  }, []);

  // Manipuladores de SMTP
  const handleSmtpChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSmtp(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const saveSmtpConfig = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/v1/smtp', smtp);
      setSmtpList([...smtpList, data]);
      showFeedback('success', 'Configuração salva com sucesso!');
    } catch (error) {
      showFeedback('error', 'Erro ao salvar configuração');
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

      console.log(data)

      showFeedback('success', `${data.sentCount} e-mails enviados com sucesso!`);
      setEmailData({
        html: emailData.html,
        recipients: [{ to: '', subject: '', attachment: null }]
      });
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      showFeedback('error', `Erro: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  // Carregar configuração selecionada
  const loadSelectedSmtp = async (id) => {
    try {
      const response = await axios.get(`/api/v1/smtp/${id}`);
      setSmtp(response.data);
      setSelectedSmtpId(id);
    } catch (err) {
     showFeedback('Erro ao carregar configuração SMTP');
    }
  };
  // Feedback visual
  const showFeedback = (type, message) => {
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
              : 'bg-red-100 text-red-800'
          }`}>
            {feedback.message}
          </div>
        )}

        {/* Seção SMTP */}
        <form onSubmit={saveSmtpConfig} className="bg-white p-6 rounded-xl shadow-sm">
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
                  {config.title} - {config.username.split('@')[0]}
                </option>
              ))}
            </select>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">Configuração SMTP</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Host</label>
              <input
                name="host"
                value={smtp.host}
                onChange={handleSmtpChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="smtp.seuprovedor.com"
                required
              />
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

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="secure"
              checked={smtp.secure}
              onChange={handleSmtpChange}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">Conexão segura (SSL/TLS)</label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {selectedSmtpId ? 'Atualizar Configuração' : 'Salvar Configuração'}
          </button>
        </form>

        {/* Seção de Envio */}
        <form onSubmit={sendEmails} className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Enviar E-mails</h2>
          
          {emailData.recipients.map((recipient, index) => (
            <div key={index} className="mb-6 border-b pb-6 last:border-b-0">
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
                  <span className="text-sm text-gray-500 mt-1">
                    Anexado: {recipient.attachment.originalname}
                  </span>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addRecipient}
            className="mb-6 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            + Adicionar Destinatário
          </button>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conteúdo HTML</label>
            <textarea
              value={emailData.html}
              onChange={(e) => setEmailData({ ...emailData, html: e.target.value })}
              className="w-full h-96 p-3 border rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500"
              spellCheck="false"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Todos os E-mails'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;