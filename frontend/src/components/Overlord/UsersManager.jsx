import React, { useState, useEffect } from 'react';
import { useOverlord } from '../../hooks/useOverlord';
import FeedbackMessage from '../UI/FeedbackMessage';
import Button from '../UI/Button';

const UsersManager = () => {
  const { orgs, addUserToOrg, getUsersByOrg, loading, error } = useOverlord();
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (selectedOrgId) {
      fetchUsers(selectedOrgId);
    }
  }, [selectedOrgId]);

  const fetchUsers = async (orgId) => {
    const orgUsers = await getUsersByOrg(orgId);
    setUsers(orgUsers || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrgId || !userEmail) {
      setMessage('Preencha todos os campos.');
      return;
    }
    const result = await addUserToOrg(selectedOrgId, userEmail, role);
    if (result) {
      setMessage('Usuário adicionado com sucesso.');
      setUserEmail('');
      setRole('user');
      fetchUsers(selectedOrgId);
    } else {
      setMessage('Falha ao adicionar usuário.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Gerenciar Usuários</h2>
      {error && <FeedbackMessage type="error" message={error} />}
      {message && <p className="mb-4 text-green-600">{message}</p>}

      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Selecione a Organização:
        </label>
        <select
          value={selectedOrgId}
          onChange={(e) => setSelectedOrgId(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        >
          <option value="">Selecione...</option>
          {orgs.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {selectedOrgId && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Usuários da Organização</h3>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">E-mail</th>
                    <th className="p-3 text-left">Papel</th>
                    <th className="p-3 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-100">
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3 flex gap-2">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                          Editar
                        </button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Nenhum usuário cadastrado nesta organização.</p>
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-4 rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-bold mb-4">Adicionar Usuário</h3>
        <div className="mb-4">
          <label className="block mb-1 font-medium">E-mail do Usuário:</label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Papel:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <Button type="submit" variant="primary" loading={loading}>
          Adicionar Usuário
        </Button>
      </form>
    </div>
  );
};

export default UsersManager;
