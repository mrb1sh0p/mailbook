import React, { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import Button from '../UI/Button';

const TableUser = ({ users, setMessage, fetchUsers, handleEditUser }) => {
  const { deleteUser, updateUser } = useUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="overflow-x-auto mb-4 dark:bg-gray-800 rounded shadow-md p-2 dark:text-white bg-white text-gray-900">
      <input
        type="text"
        placeholder="Buscar usuário"
        value={search}
        onChange={handleSearch}
        className="p-2 border rounded-lg w-full dark:bg-gray-700 dark:text-white"
      />
      <table className="rounded-lg w-full mt-4">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="p-3 text-left">Nome Completo</th>
            <th className="p-3 text-left">E-mail</th>
            <th className="p-3 text-left">Username</th>
            <th className="p-3 text-left">Papel</th>
            <th className="p-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr
              key={user.id}
              className={`transition duration-150 ${
                index % 2 === 0 ? '' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <td className="p-3">
                {user.name} {user.last_name}
              </td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.username}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3 flex gap-2 justify-end">
                <Button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowChangePassword(true);
                  }}
                  variant="secondary"
                  className="min-w-[100px]"
                >
                  Alterar Senha
                </Button>
                <Button
                  onClick={() => handleEditUser(user)}
                  variant="edit"
                  className="min-w-[100px]"
                >
                  Editar
                </Button>
                <Button
                  onClick={async () => {
                    await deleteUser(user.id);
                    setMessage({
                      message: 'Usuário removido com sucesso',
                      type: 'success',
                    });
                    await fetchUsers();
                  }}
                  variant="danger"
                  className="min-w-[100px]"
                >
                  Remover
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 dark:bg-gray-800">
            <h2 className="text-lg font-bold mb-4">Alterar Senha</h2>
            <input
              type="password"
              className="w-full p-2 border rounded-lg mb-3 dark:bg-gray-700 dark:text-white"
              placeholder="Nova Senha"
            />
            <input
              type="password"
              className="w-full p-2 border rounded-lg mb-3 dark:bg-gray-700 dark:text-white"
              placeholder="Confirmar Senha"
            />
            <div className="flex justify-end gap-2 dark:text-white">
              <button
                onClick={() => setShowChangePassword(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded dark:bg-gray-600 hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await updateUser(selectedUser);
                  setShowChangePassword(false);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition dark:bg-green-600"
              >
                Alterar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableUser;
