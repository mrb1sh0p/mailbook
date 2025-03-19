import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import SMTPConfigForm from './SMTPConfigForm';
import SMTPConfigSelector from './SMTPConfigSelector';

const SMTPConfigPanel = ({
  configs,
  selectedConfig,
  onSave,
  onSelect,
  loading,
  showConfig,
  toggleShowConfig,
  onDelete,
  resetSelectedConfig
}) => {

  const handleSelect = (id) => {
    onSelect(id);
    if (!id) resetSelectedConfig();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleShowConfig}
      >
        <h2 className="text-2xl font-bold text-gray-800">Configuração SMTP</h2>
        {showConfig ? (
          <ChevronUpIcon className="h-6 w-6 text-gray-600" />
        ) : (
          <ChevronDownIcon className="h-6 w-6 text-gray-600" />
        )}
      </div>

      {showConfig && (
        <div className="mt-6">
          <SMTPConfigSelector 
            configs={configs}
            selectedId={selectedConfig?.id}
            onSelect={handleSelect}
          />
          
          <SMTPConfigForm 
            initialConfig={selectedConfig || {
              title: '',
              host: '',
              port: 587,
              secure: 'TLS',
              username: '',
              pass: ''
            }}
            onSave={onSave}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default SMTPConfigPanel;