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

const SMTPConfigForm = ({ initialConfig, onUpdate, onSave, loading }) => {
  const initialState =
    initialConfig && initialConfig.id ? initialConfig : defaultConfig;
  const [config, setConfig] = useState(initialState);
  const [encryptionType, setEncryptionType] = useState(
    initialState.secure?.toUpperCase() === 'SSL' ? 'ssl' : 'tls'
  );

  useEffect(() => {
    const newState =
      initialConfig && initialConfig.id ? initialConfig : defaultConfig;
    setConfig(newState);
    setEncryptionType(newState.secure?.toUpperCase() === 'SSL' ? 'ssl' : 'tls');
  }, [initialConfig]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: name === 'port' ? Number(value) : value,
    }));
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

    if (config.id) {
      onUpdate(config);
    } else {
      onSave(config);
    }
  };

  const Input = ({ label, name, type = 'text', required = true }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">
        {label}
      </label>
      <input
        name={name}
        value={config[name]}
        onChange={handleChange}
        type={type}
        className="w-full p-2 border rounded-md dark:bg-gray-800"
        required={required}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input label="Título" name="title" />
        <Input label="Host" name="host" />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
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

        <Input label="Porta" name="port" type="number" />
        <Input label="Usuário" name="username" />
        <Input label="Senha" name="pass" type="password" />
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
