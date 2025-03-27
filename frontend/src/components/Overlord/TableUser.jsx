import React, { useState } from 'react';
import { useUser } from '../../hooks/useUser';

const TableUser = ({ users, setMessage, fetchUsers, selectedOrgId }) => {
  const { deleteUser } = useUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { updateUser } = useUser();

  return (
    <div className="overflow-x-auto mb-4 dark:bg-gray-800 rounded shadow-md p-2 dark:text-white bg-white text-gray-900">
      <table className="min-w-full rounded-lg">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="p-3 text-left">Nome</th>
            <th className="p-3 text-left">E-mail</th>
            <th className="p-3 text-left">Papel</th>
            <th className="p-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-100 transition duration-150"
            >
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3 flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    console.log(user);
                    setShowChangePassword(true);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                >
                  Alterar Senha
                </button>
                <button
                  onClick={async () => {
                    await deleteUser(user.id);
                    setMessage({
                      message: 'Usuário removido com sucesso',
                      type: 'success',
                    });
                    await fetchUsers();
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Alterar Senha</h2>
            <input
              type="password"
              className="w-full p-2 border rounded-lg mb-3"
              placeholder="Nova Senha"
            />
            <input
              type="password"
              className="w-full p-2 border rounded-lg mb-3"
              placeholder="Confirmar Senha"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowChangePassword(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await updateUser(selectedUser);
                  setShowChangePassword(false);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
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
