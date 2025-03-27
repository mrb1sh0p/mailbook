import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useOverlord } from '../../hooks/useOverlord';
import TableUser from './TableUser';
import NewUserForms from './NewUserForms';
import Button from '../UI/Button';

const UsersManager = () => {
  const { orgs, getUsersByOrg } = useOverlord();
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [message, setMessage] = useState(null);
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

  useEffect(() => {
    if (selectedOrgId) {
      fetchUsers(selectedOrgId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrgId]);

  const fetchUsers = async (orgId) => {
    try {
      const orgUsers = await getUsersByOrg(orgId);
      setUsers(orgUsers || []);
    } catch (error) {
      setMessage({ type: 'error', message: 'Erro ao carregar usuários' });
    }
  };

  const handleEditUser = (user) => {
    setUser(user);
    setShowAddUser(true);
  }

  const handleAddUserClick = () => {
    setShowAddUser(showAddUser ? false : true);
  };

  const handleCancelAddUser = () => {
    setShowAddUser(false);
  };

  const closeMessage = () => setMessage(null);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Gerenciar Usuários
      </h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg flex justify-between items-center 
          ${
            message.type === 'error'
              ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200'
              : 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200'
          }`}
        >
          <p>{message.message}</p>
          <button
            onClick={closeMessage}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div className="mb-4 w-full">
        <label className="block mb-2 font-medium text-gray-900 dark:text-white">
          Selecione a Organização:
        </label>
        <div className="mb-4 flex gap-4 items-center justify-between">
          <select
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white text-black dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="" disabled>
              Selecione...
            </option>
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <div className="min-w-[120px]">
            <Button
              onClick={handleAddUserClick}
              variant="primary"
              disabled={!selectedOrgId}
            >
              Novo Usuário
            </Button>
          </div>
        </div>
      </div>

      {showAddUser && (
        <div className="mt-6">
          <NewUserForms
            setMessage={setMessage}
            selectedOrgId={selectedOrgId}
            fetchUsers={fetchUsers}
            setShowAddUser={setShowAddUser}
            handleCancelAddUser={handleCancelAddUser}
            user={user}
            setUser={setUser}
          />
        </div>
      )}

      {selectedOrgId && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
            Usuários da Organização
          </h3>
          {users.length > 0 ? (
            <TableUser
              users={users}
              selectedOrgId={selectedOrgId}
              setMessage={setMessage}
              fetchUsers={() => fetchUsers(selectedOrgId)}
              handleEditUser={handleEditUser}
            />
          ) : (
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Nenhum usuário cadastrado nesta organização.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersManager;
