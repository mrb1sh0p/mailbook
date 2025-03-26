import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { useOverlord } from '../../hooks/useOverlord';
import TableUser from './TableUser';
import NewUserForms from './NewUserForms';

const UsersManager = () => {
  const { orgs, getUsersByOrg } = useOverlord();
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [message, setMessage] = useState(null);

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

  const closeMessage = () => setMessage(null);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Gerenciar Usuários</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg flex justify-between items-center 
            ${
              message.type === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
        >
          <p>{message.message}</p>
          <button
            onClick={closeMessage}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes />
          </button>
        </div>
      )}

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
            setShowAddUser={setShowAddUser}
          />
        </div>
      )}

      {selectedOrgId && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Usuários da Organização</h3>
          {users.length > 0 ? (
            <TableUser
              users={users}
              selectedOrgId={selectedOrgId}
              setMessage={setMessage}
              fetchUsers={() => fetchUsers(selectedOrgId)}
            />
          ) : (
            <p className="mb-4 text-gray-600">
              Nenhum usuário cadastrado nesta organização.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersManager;
