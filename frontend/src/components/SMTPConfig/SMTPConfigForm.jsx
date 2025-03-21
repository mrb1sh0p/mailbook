import { useState, useEffect } from 'react';
import Button from '../UI/Button';

const SMTPConfigForm = ({ initialConfig, onUpdate, onSave, loading }) => {
  const [config, setConfig] = useState(initialConfig);
  const [encryptionType, setEncryptionType] = useState(
    initialConfig.secure === 'SSL' ? 'ssl' : 'tls'
  );

  useEffect(() => {
    setConfig(initialConfig);
    setEncryptionType(
      initialConfig.secure?.toLowerCase() === 'ssl' ? 'ssl' : 'tls'
    );
  }, [initialConfig]);

  useEffect(() => {
    if (!initialConfig.id) {
      setConfig({
        title: '',
        host: '',
        port: 587,
        secure: 'TLS',
        username: '',
        pass: '',
      });
    }
  }, [initialConfig.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleEncryptionChange = (e) => {
    const type = e.target.value;
    setEncryptionType(type);
    setConfig((prev) => ({
      ...prev,
      secure: type.toUpperCase(),
      port: type === 'ssl' ? 465 : 587,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedConfig = {
      ...config,
      port: config.port,
    };

    if (cleanedConfig.id) {
      onUpdate(cleanedConfig);
    } else {
      onSave(cleanedConfig);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            name="title"
            value={config.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Host SMTP
          </label>
          <input
            name="host"
            value={config.host}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Criptografia
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Porta
          </label>
          <input
            type="number"
            name="port"
            value={config.port}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Usuário
          </label>
          <input
            name="username"
            value={config.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            name="pass"
            value={config.pass}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-2 mb-4">
        {encryptionType === 'ssl' ? (
          <span>✔️ Conexão segura via SSL na porta {config.port}</span>
        ) : (
          <span>
            ✔️ Conexão segura via TLS (STARTTLS) na porta {config.port}
          </span>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full"
      >
        {initialConfig.id ? 'Atualizar Configuração' : 'Salvar Configuração'}
      </Button>
    </form>
  );
};

export default SMTPConfigForm;
