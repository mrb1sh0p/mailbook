import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import Input from './Input';

const OrganizationForm = ({ initialOrg, onSubmit, onCancel, loading }) => {
  const [org, setOrg] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    cnpj: '',
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

    if (name === 'cnpj') {
      const cnpj = value.replace(/\D/g, '');
      setOrg((prev) => ({ ...prev, [name]: cnpj }));
      return;
    }

    setOrg((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(org);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4">
      <div className="mb-4 gap-4 flex">
        <Input
          label={'CNPJ:'}
          type="text"
          name="cpnj"
          value={org.cnpj}
          onChange={handleChange}
        />
        <Input
          label={'Nome da Organização:'}
          type="text"
          name="name"
          value={org.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4 gap-4 flex">
        <Input
          label={'Telefone:'}
          type="text"
          name="phone"
          value={org.phone}
          onChange={handleChange}
        />
        <Input
          label={'Email:'}
          type="email"
          name="email"
          value={org.email}
          onChange={handleChange}
        />
      </div>
      <Input
        label={'Endereço:'}
        type="text"
        name="address"
        value={org.address}
        onChange={handleChange}
      />
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
