import React, { useState, useEffect } from 'react';
import { useOverlord } from '../../hooks/useOverlord';
import FeedbackMessage from '../UI/FeedbackMessage';
import NewUserForms from './NewUserForms';

const UsersManager = () => {
  const { orgs, getUsersByOrg, error } = useOverlord();
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (selectedOrgId) {
      fetchUsers(selectedOrgId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrgId]);

  const fetchUsers = async (orgId) => {
    const orgUsers = await getUsersByOrg(orgId);
    setUsers(orgUsers || []);
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
            <p className="mb-4">Nenhum usuário cadastrado nesta organização.</p>
          )}
          <NewUserForms
            setMessage={setMessage}
            selectedOrgId={selectedOrgId}
            fetchUsers={fetchUsers}
          />
        </div>
      )}
    </div>
  );
};

export default UsersManager;
