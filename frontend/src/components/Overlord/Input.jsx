const Input = ({ label, type, name, value, onChange }) => {
  return (
    <div className="mb-4 w-full relative mb-4 dark:text-white">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-700"
        required
      />
    </div>
  );
};

export default Input;
