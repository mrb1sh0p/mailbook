import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import SMTPConfigForm from './SMTPConfigForm';
import SMTPConfigSelector from './SMTPConfigSelector';

const SMTPConfigPanel = ({
  configs,
  selectedConfig,
  onSelect,
  loading,
  showConfig,
  toggleShowConfig,
  onUpdate,
  onSave,
}) => {
  const handleSelect = (id) => {
    onSelect(id);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleShowConfig}
      >
        <h2 className="text-2xl font-bold text-gray-800">Configuração SMTP</h2>
        {showConfig ? (
          <FaChevronUp className="h-6 w-6 text-gray-600" />
        ) : (
          <FaChevronDown className="h-6 w-6 text-gray-600" />
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
            initialConfig={selectedConfig || {}}
            onUpdate={onUpdate}
            onSave={onSave}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default SMTPConfigPanel;
