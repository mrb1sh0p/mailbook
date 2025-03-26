const Input = ({ label, type, name, value, onChange }) => {
  return (
    <div className="mb-4 w-full relative mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded"
        required
      />
    </div>
  );
};

export default Input;
