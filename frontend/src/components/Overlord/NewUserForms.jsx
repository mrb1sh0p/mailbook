import { useState } from 'react';
import Button from '../UI/Button';
import { useOverlord } from '../../hooks/useOverlord';
import InputFormsUsers from './InputFormsUsers';
import { useUser } from '../../hooks/useUser';

const NewUserForms = ({
  setMessage,
  setShowAddUser,
  selectedOrgId,
  fetchUsers,
}) => {
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

  const { addUserToOrg, updateRoleUserInOrg, getUsersByOrg, loading } =
    useOverlord();
  const {
    createUser,
    updateUser,
    selectUserByCpf,
    deleteUser,
    loading: load,
  } = useUser();
  const [cpfDebounce, setCpfDebounce] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newUser) {
      try {
        const res = await createUser({ ...user, role: 'user' });
        try {
          await addUserToOrg(selectedOrgId, res.id);
          await updateRoleUserInOrg(res.id, selectedOrgId, user.role);
          setMessage({
            message: 'Usuário adicionado com sucesso',
            type: 'success',
          });
          setUser({
            id: '',
            name: '',
            last_name: '',
            username: '',
            email: '',
            password: '',
            cpf: '',
            role: 'user',
          });
          setNewUser(false);
        } catch (orgError) {
          await deleteUser(res.id);
          setMessage({
            message:
              orgError.response?.data?.error || 'Erro ao adicionar usuário',
            type: 'error',
          });
          return;
        }
        await fetchUsers(selectedOrgId);
      } catch (userError) {
        setMessage({
          message:
            userError.response?.data?.error || 'Erro ao adicionar usuário',
          type: 'error',
        });
      }
    } else {
      try {
        await updateUser(user);
        setMessage({
          message: 'Usuário atualizado com sucesso',
          type: 'success',
        });

        const userInOrg = await getUsersByOrg(selectedOrgId);

        if (!userInOrg.find((u) => u.id === user.id)) {
          await addUserToOrg(selectedOrgId, user.id);
          await updateRoleUserInOrg(user.id, selectedOrgId, user.role);
        }

        await fetchUsers(selectedOrgId);

        setUser({
          id: '',
          name: '',
          last_name: '',
          username: '',
          email: '',
          password: '',
          cpf: '',
          role: 'user',
        });
      } catch (updateError) {
        setMessage({
          message:
            updateError.response?.data?.error || 'Erro ao atualizar usuário',
          type: 'error',
        });
      }
    }
    setShowAddUser(false);
  };

  const fetchUserByCpf = async (cpfValue) => {
    try {
      const data = await selectUserByCpf(cpfValue);
      if (data) {
        setUser(data);
        setNewUser(false);
      } else {
        setNewUser(true);
        setUser((prev) => ({ ...prev, id: '' }));
      }
    } catch (err) {
      console.error('Erro ao buscar usuário por CPF:', err);
      setMessage({
        message: 'Erro ao buscar usuário por CPF',
        type: 'error',
      });
    }
  };

  const handleCpfChange = (e) => {
    setUser((prev) => ({ ...prev, id: '', cpf: e.target.value }));
    if (cpfDebounce) {
      clearTimeout(cpfDebounce);
    }
    const cpfValue = e.target.value;
    const timeout = setTimeout(() => {
      if (cpfValue.length === 11) {
        fetchUserByCpf(cpfValue);
      } else {
        setUser({
          id: '',
          name: '',
          last_name: '',
          username: '',
          email: '',
          password: '',
          cpf: '',
          role: 'user',
        });
        setMessage({
          message: 'CPF deve conter 11 dígitos',
          type: 'error',
        });
      }
    }, 1000);
    setCpfDebounce(timeout);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-4 rounded-lg shadow-sm mb-4"
    >
      <h3 className="text-lg font-bold mb-4">
        {newUser ? 'Adicionar Usuário' : 'Atualizar Usuário'}
      </h3>
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
          name="name"
          value={user.name}
          setValue={setUser}
          label="Nome:"
        />
        <InputFormsUsers
          type="text"
          user={user}
          name="last_name"
          value={user.last_name}
          setValue={setUser}
          label="Sobrenome:"
        />
      </div>
      <div className="flex gap-4 justify-between">
        <InputFormsUsers
          type="text"
          user={user}
          name="username"
          value={user.username}
          setValue={setUser}
          label="Usuário:"
        />
        <InputFormsUsers
          type="password"
          user={user}
          name="password"
          value={user.password}
          setValue={setUser}
          label="Senha:"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Papel:</label>
        <select
          value={user.role}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="user">Usuário</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <Button type="submit" variant="primary" loading={loading || load}>
        {newUser ? 'Adicionar Usuário' : 'Atualizar Usuário'}
      </Button>
    </form>
  );
};

export default NewUserForms;
