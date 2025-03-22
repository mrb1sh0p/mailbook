import React, { useState, useEffect } from 'react';
import { useOverlord } from '../../hooks/useOverlord';
import { useAuth } from '../../contexts/AuthContext';
import FeedbackMessage from '../../components/UI/FeedbackMessage';

const OverlordPage = () => {
  const { orgs, loading, error } = useOverlord();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          {loading ? (
            <div>Carregando...</div>
          ) : (
            <div>
              <p>Overlord</p>
            </div>
          )}
          <button onClick={logout}>Sair</button>
        </header>

        {error && <FeedbackMessage type="error" message={error} />}

        <div className="space-y-4">
          {orgs.length ? (
            orgs.map((org) => (
              <div key={org.id} className="bg-white p-4 shadow-md rounded-md">
                <p>{org.name}</p>
              </div>
            ))
          ) : (
            <p>Nenhuma organização cadastrada</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverlordPage;
