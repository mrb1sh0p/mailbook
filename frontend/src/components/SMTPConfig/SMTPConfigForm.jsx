import { useState, useEffect } from 'react';
import Button from '../UI/Button';

const defaultConfig = {
  title: '',
  host: '',
  port: 587,
  secure: 'TLS',
  username: '',
  pass: '',
};

const SMTPConfigForm = ({
  initialConfig,
  onUpdate,
  onSave,
  loading,
  org_id,
}) => {
  const [config, setConfig] = useState(defaultConfig);
  const [encryptionType, setEncryptionType] = useState('tls');

  useEffect(() => {
    if (initialConfig && initialConfig.id) {
      setConfig(initialConfig);
      setEncryptionType(
        initialConfig.secure?.toUpperCase() === 'SSL' ? 'ssl' : 'tls'
      );
    }
  }, [initialConfig]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: name === 'port' ? Number(value) : value,
    }));
  };

  const handleEncryptionChange = (e) => {
    const type = e.target.value;
    setEncryptionType(type);
    setConfig((prevConfig) => ({
      ...prevConfig,
      secure: type.toUpperCase(),
      port: type === 'ssl' ? 465 : 587,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newConfig = {
      ...config,
      orgId: org_id,
    };
    config.id ? onUpdate(newConfig) : onSave(newConfig);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">
            Título
          </label>
          <input
            name="title"
            value={config.title}
            onChange={handleChange}
            type="text"
            className="w-full p-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">
            Host
          </label>
          <input
            name="host"
            value={config.host}
            onChange={handleChange}
            type="text"
            className="w-full p-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">
            Tipo de Criptografia
          </label>
          <select
            value={encryptionType}
            onChange={handleEncryptionChange}
            className="w-full p-2 border rounded-md dark:bg-gray-800"
          >
            <option value="tls">TLS (Recomendado)</option>
            <option value="ssl">SSL</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">
            Porta
          </label>
          <input
            name="port"
            value={config.port}
            onChange={handleChange}
            type="number"
            className="w-full p-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">
            Usuário
          </label>
          <input
            name="username"
            value={config.username}
            onChange={handleChange}
            type="text"
            className="w-full p-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">
            Senha
          </label>
          <input
            name="pass"
            value={config.pass}
            onChange={handleChange}
            type="password"
            className="w-full p-2 border rounded-md dark:bg-gray-800"
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
        {config.id ? 'Atualizar Configuração' : 'Salvar Configuração'}
      </Button>
    </form>
  );
};

export default SMTPConfigForm;
