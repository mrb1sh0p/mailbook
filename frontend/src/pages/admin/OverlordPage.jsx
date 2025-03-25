import React, { useState } from 'react';
import { useOverlord } from '../../hooks/useOverlord';
import { useAuth } from '../../contexts/AuthContext';
import FeedbackMessage from '../../components/UI/FeedbackMessage';
import OrganizationsManager from '../../components/Overlord/OrganizationsManager';
import UsersManager from '../../components/Overlord/UsersManager';

const OverlordPage = () => {
  const { error, loading } = useOverlord();
  const { logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('orgs');

  const renderContent = () => {
    switch (activeMenu) {
      case 'orgs':
        return <OrganizationsManager />;
      case 'users':
        return <UsersManager />;
      default:
        return <div>Selecione uma função no menu</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Menu Admin</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveMenu('orgs')}
              className={`w-full text-left p-2 rounded ${
                activeMenu === 'orgs'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              Organizações
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveMenu('users')}
              className={`w-full text-left p-2 rounded ${
                activeMenu === 'users'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              Usuários
            </button>
          </li>
        </ul>
        <button
          onClick={logout}
          className="mt-4 w-full bg-red-500 text-white p-2 rounded"
        >
          Sair
        </button>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">Página do Overlord</h1>
        </header>
        {error && <FeedbackMessage type="error" message={error} />}
        {loading ? <div>Carregando...</div> : renderContent()}
      </main>
    </div>
  );
};

export default OverlordPage;
