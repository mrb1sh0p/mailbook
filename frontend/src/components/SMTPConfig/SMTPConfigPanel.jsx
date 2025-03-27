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
    </div>
  );
};

export default SMTPConfigPanel;
