import { useState } from 'react';
import axios from 'axios';

function App() {
  const [smtp, setSmtp] = useState({
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: ''
  });
  
  const [email, setEmail] = useState({
    to: '',
    subject: '',
    html: '<h1>Hello World</h1>'
  });

  const saveSmtp = async (e) => {
    e.preventDefault();
    await axios.post('/api/email/smtp', smtp);
  };

  const sendEmails = async (e) => {
    e.preventDefault();
    await axios.post('/api/email/send', {
      ...email,
      smtpConfig: smtp
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* SMTP Form */}
        <form onSubmit={saveSmtp} className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">SMTP Configuration</h2>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Host" 
              className="border p-2 rounded"
              value={smtp.host} onChange={e => setSmtp({...smtp, host: e.target.value})}
            />
            <input type="number" placeholder="Port"
              className="border p-2 rounded"
              value={smtp.port} onChange={e => setSmtp({...smtp, port: e.target.value})}
            />
            <input type="text" placeholder="User"
              className="border p-2 rounded"
              value={smtp.user} onChange={e => setSmtp({...smtp, user: e.target.value})}
            />
            <input type="password" placeholder="Password"
              className="border p-2 rounded"
              value={smtp.pass} onChange={e => setSmtp({...smtp, pass: e.target.value})}
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Save SMTP
          </button>
        </form>

        {/* Email Form */}
        <form onSubmit={sendEmails} className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Send Emails</h2>
          <input type="text" placeholder="To (comma-separated)"
            className="border p-2 rounded w-full mb-4"
            value={email.to} onChange={e => setEmail({...email, to: e.target.value})}
          />
          <input type="text" placeholder="Subject"
            className="border p-2 rounded w-full mb-4"
            value={email.subject} onChange={e => setEmail({...email, subject: e.target.value})}
          />
          <textarea 
            className="border p-2 rounded w-full h-64 font-mono mb-4"
            value={email.html} onChange={e => setEmail({...email, html: e.target.value})}
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Send Emails
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;