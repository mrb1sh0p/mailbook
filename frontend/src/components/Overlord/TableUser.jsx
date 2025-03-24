import { useUser } from '../../hooks/useUser';

const TableUser = ({ users, setMessage, fetchUsers }) => {
  const { deleteUser } = useUser();

  return (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full border rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Nome</th>
            <th className="p-3 text-left">E-mail</th>
            <th className="p-3 text-left">Papel</th>
            <th className="p-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-100 mb-2">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3 flex gap-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  Editar
                </button>
                <button
                  onClick={async () => {
                    await deleteUser(user.id);
                    setMessage('Usuário removido com sucesso');
                    await fetchUsers();
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableUser;
