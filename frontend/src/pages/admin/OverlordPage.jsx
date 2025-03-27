import React, { useState } from 'react';
import { useOverlord } from '../../hooks/useOverlord';
import { useAuth } from '../../contexts/AuthContext';
import FeedbackMessage from '../../components/UI/FeedbackMessage';
import OrganizationsManager from '../../components/Overlord/OrganizationsManager';
import UsersManager from '../../components/Overlord/UsersManager';
import SMTPConfigPanel from '../../components/SMTPConfig/SMTPConfigPanel';
import DarkModeToggle from '../../components/DarkModeToggle';
import {
  FaBuilding,
  FaUsers,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCogs,
} from 'react-icons/fa';

const OverlordPage = () => {
  const { error, loading } = useOverlord();
  const { logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('orgs');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'orgs':
        return <OrganizationsManager />;
      case 'smtp':
        return <SMTPConfigPanel />;
      case 'users':
        return <UsersManager />;
      default:
        return <div>Selecione uma função no menu</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 flex">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-white dark:bg-gray-800 shadow-md p-4 transition-all duration-300 flex flex-col justify-between relative`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-[-12px] bg-blue-500 text-white rounded-full p-1 shadow-md"
        >
          {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>

        <div>
          {sidebarOpen && (
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Menu Admin
            </h2>
          )}
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveMenu('orgs')}
                className={`w-full flex items-center gap-2 p-2 rounded ${
                  activeMenu === 'orgs'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300'
                }`}
              >
                <FaBuilding />
                {sidebarOpen && 'Organizações'}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('smtp')}
                className={`w-full flex items-center gap-2 p-2 rounded dark:text-white ${
                  activeMenu === 'smtp'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 text-gray-900 dark:hover:bg-gray-600'
                }`}
              >
                <FaCogs />
                {sidebarOpen && 'SMTP Config'}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('users')}
                className={`w-full flex items-center gap-2 p-2 rounded ${
                  activeMenu === 'users'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300'
                }`}
              >
                <FaUsers />
                {sidebarOpen && 'Usuários'}
              </button>
            </li>
          </ul>
        </div>

        <div className="mt-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 bg-red-500 text-white p-2 rounded"
          >
            <FaSignOutAlt />
            {sidebarOpen && 'Sair'}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 text-gray-900 dark:text-gray-100">
        <header className="mb-4 flex justify-end items-center">
          <DarkModeToggle />
        </header>
        {error && <FeedbackMessage type="error" message={error} />}
        {loading ? <div>Carregando...</div> : renderContent()}
      </main>
    </div>
  );
};

export default OverlordPage;
