import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useOverlord } from '../../hooks/useOverlord';
import TableUser from './TableUser';
import FeedbackMessage from '../UI/FeedbackMessage';
import NewUserForms from './NewUserForms';

const UsersManager = () => {
  const { orgs, getUsersByOrg, error } = useOverlord();
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(true);

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

  const toggleShowAddUser = () => setShowAddUser((prev) => !prev);

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

      <div
        className="flex items-center justify-between cursor-pointer mb-4"
        onClick={toggleShowAddUser}
      >
        <h2 className="text-2xl font-bold text-gray-800">Novo usuário</h2>
        {showAddUser ? (
          <FaChevronUp className="h-6 w-6 text-gray-600" />
        ) : (
          <FaChevronDown className="h-6 w-6 text-gray-600" />
        )}
      </div>
      {showAddUser && (
        <div className="mt-6">
          <NewUserForms
            setMessage={setMessage}
            selectedOrgId={selectedOrgId}
            fetchUsers={fetchUsers}
          />
        </div>
      )}

      {selectedOrgId && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Usuários da Organização</h3>
          {users.length > 0 ? (
            <TableUser
              users={users}
              setMessage={setMessage}
              fetchUsers={() => {
                fetchUsers(selectedOrgId);
              }}
            />
          ) : (
            <p className="mb-4">Nenhum usuário cadastrado nesta organização.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersManager;
