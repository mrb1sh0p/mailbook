import { useState } from 'react';
import Button from '../UI/Button';
import FeedbackMessage from '../UI/FeedbackMessage';
import { useOverlord } from '../../hooks/useOverlord';
import InputFormsUsers from './InputFormsUsers';
import { useUser } from '../../hooks/useUser';

const NewUserForms = (setMessage, selectedOrgId, fetchUsers) => {
  const [enable, setEnable] = useState(false);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    cpf: '',
    role: '' || 'user',
  });

  const { addUserToOrg, loading } = useOverlord();
  const { createUser, selectUserByCpf, loading: load } = useUser();
  const [cpfDebounce, setCpfDebounce] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newUser) {
      try {
        const data = await createUser({
          ...user,
          role: 'user',
        });
        await addUserToOrg(selectedOrgId, data.id, user.role);
        fetchUsers();
      } catch (error) {}
    } else {
      // TODO: criar atualização do usuario
    }
    setError(null);
  };

  const fetchUserByCpf = async (cpfValue) => {
    try {
      const data = await selectUserByCpf(cpfValue);

      if (data) {
        setUser(data);
        setNewUser(false);
      } else {
        setNewUser(true);
      }

      setEnable(true);
    } catch (error) {
      console.error('Erro ao buscar usuário por CPF:', error);
    }
  };

  const handleCpfChange = (e) => {
    const cpfValue = e.target.value;
    setUser((prev) => ({ ...prev, cpf: cpfValue }));

    if (cpfDebounce) {
      clearTimeout(cpfDebounce);
    }

    const timeout = setTimeout(() => {
      if (cpfValue.length === 11) {
        fetchUserByCpf(cpfValue);
      } else {
        setEnable(false);
        setError('CPF deve conter 11 dígitos');
      }
    }, 500);
    setCpfDebounce(timeout);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-4 rounded-lg shadow-sm "
    >
      {error && <FeedbackMessage type="error" message={error} />}
      <h3 className="text-lg font-bold mb-4">Adicionar Usuário</h3>
      <div className="flex gap-4 justify-between">
        <div className="w-full relative mb-4">
          <label className="block mb-1 font-medium">CPF:</label>
          <input
            name="cpf"
            type="text"
            value={user.cpf}
            onChange={handleCpfChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <InputFormsUsers
          user={user}
          enable={enable}
          type="email"
          name="email"
          value={user.email}
          setValue={setUser}
          label="E-mail do Usuário:"
        />
      </div>

      <div className="flex gap-4 justify-between">
        <InputFormsUsers
          type="text"
          user={user}
          enable={enable}
          name="name"
          value={user.name}
          setValue={setUser}
          label="Nome:"
        />

        <InputFormsUsers
          type="text"
          user={user}
          enable={enable}
          name="last_name"
          value={user.last_name}
          setValue={setUser}
          label="Sobrenome:"
        />
      </div>

      <div className="flex gap-4 justify-between">
        <InputFormsUsers
          type="text"
          enable={enable}
          user={user}
          name="username"
          value={user.username}
          setValue={setUser}
          label="Usuário:"
        />
        <InputFormsUsers
          type="password"
          user={user}
          enable={enable}
          name="password"
          value={user.password}
          setValue={setUser}
          label="Senha:"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Papel:</label>
        <select
          disabled={!enable}
          value={user.role}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="user">Usuário</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <Button type="submit" variant="primary" loading={loading || load}>
        {user.id ? 'Atualizar Usuário' : 'Adicionar Usuário'}
      </Button>
    </form>
  );
};

export default NewUserForms;
