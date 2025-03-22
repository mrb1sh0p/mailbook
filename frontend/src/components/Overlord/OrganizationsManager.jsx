import React, { useState } from 'react';
import { useOverlord } from '../../hooks/useOverlord';
import OrganizationForm from './OrganizationForm';
import FeedbackMessage from '../UI/FeedbackMessage';

const OrganizationsManager = () => {
  const { orgs, createOrg, updateOrg, deleteOrg, loading, error, fetchOrgs } =
    useOverlord();
  const [editingOrg, setEditingOrg] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (org) => {
    setEditingOrg(org);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingOrg(null);
    setShowForm(true);
  };

  const handleSubmit = async (orgData) => {
    if (orgData.id) {
      await updateOrg(orgData);
    } else {
      await createOrg(orgData);
    }
    setShowForm(false);
    // Atualiza a lista se necessário
    fetchOrgs();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gerenciar Organizações</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleNew}
        >
          Nova Organização
        </button>
      </div>

      {error && <FeedbackMessage type="error" message={error} />}

      {showForm && (
        <OrganizationForm
          initialOrg={editingOrg}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          loading={loading}
        />
      )}

      <div className="space-y-4 mt-4">
        {orgs && orgs.length ? (
          orgs.map((org) => (
            <div
              key={org.id}
              className="bg-white p-4 shadow rounded flex justify-between items-center"
            >
              <p className="font-bold">{org.name}</p>
              <div>
                <button
                  className="mr-2 bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(org)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteOrg(org.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhuma organização cadastrada</p>
        )}
      </div>
    </div>
  );
};

export default OrganizationsManager;
