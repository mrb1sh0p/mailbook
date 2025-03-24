import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const InputFormsUsers = ({ value, user, type, setValue, label, name }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleUserChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setValue({ ...user, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="w-full relative mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        name={name}
        type={inputType}
        value={value}
        onChange={handleUserChange}
        className="w-full p-2 border rounded-lg"
        required
      />
      {type === 'password' && (
        <button
          type="button"
          className="absolute right-2 top-2 text-gray-600"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );
};

export default InputFormsUsers;
