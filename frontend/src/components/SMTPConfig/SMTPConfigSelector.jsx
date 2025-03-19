const SMTPConfigSelector = ({ configs, selectedId, onSelect }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">Configuração Existente:</label>
      <select 
        className="border p-2 rounded w-full"
        onChange={(e) => onSelect(e.target.value)}
        value={selectedId || ''}
      >
        <option value="">Nova Configuração</option>
        {configs.map((config) => (
          <option key={config.id} value={config.id}>
            {config.title} ({config.host})
          </option>
        ))}
      </select>
    </div>
  );
};

export default SMTPConfigSelector;