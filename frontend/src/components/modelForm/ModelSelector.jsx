const ModelSelector = ({ models, selectedId, onSelect }) => {
  return (
    <select
      className="px-2 py-1 border rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none"
      value={selectedId || ''}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">Novo Modelo</option>
      {models.map((model) => (
        <option key={model.id} value={model.id}>
          {model.title}
        </option>
      ))}
    </select>
  );
};

export default ModelSelector;
