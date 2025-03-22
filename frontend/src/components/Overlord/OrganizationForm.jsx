import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';

const OrganizationForm = ({ initialOrg, onSubmit, onCancel, loading }) => {
  const [org, setOrg] = useState({
    name: '',
    // adicione outros campos se necessário
  });

  useEffect(() => {
    if (initialOrg) {
      setOrg(initialOrg);
    } else {
      setOrg({ name: '' });
    }
  }, [initialOrg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrg((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(org);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4">
      <div className="mb-4">
        <label className="block mb-1 font-medium">Nome da Organização:</label>
        <input
          type="text"
          name="name"
          value={org.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="flex space-x-4">
        <Button type="submit" variant="primary" loading={loading}>
          {org.id ? 'Atualizar Organização' : 'Criar Organização'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default OrganizationForm;
