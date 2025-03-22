import axios from 'axios';
import { useEffect, useState } from 'react';

export const useOverlord = () => {
  const token = localStorage.getItem('overlordToken');
  const [loading, setLoading] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);

  axios.defaults.headers.common.Authorization = `Bearer ${token}`;

  const fetchOrgs = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await axios.get('/api/v1/orgs/all');
      setOrgs(data);
    } catch (err) {
      console.error('Erro ao carregar organizações:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createOrg = async (org) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/orgs', org);
      return data;
    } catch (err) {
      console.error('Erro ao criar organização:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrg = async (org) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/v1/orgs/${org.id}`, org);
      return data;
    } catch (err) {
      console.error('Erro ao atualizar organização:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrg = async (orgId) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/v1/orgs/${orgId}`);
      return data;
    } catch (err) {
      console.error('Erro ao deletar organização:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addUserToOrg = async (orgId, userId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/v1/org/${orgId}/users/${userId}`);
      return data;
    } catch (err) {
      console.error('Erro ao adicionar usuário à organização:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeUserFromOrg = async (orgId, userId) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `/api/v1/org/${orgId}/users/${userId}`
      );
      return data;
    } catch (err) {
      console.error('Erro ao remover usuário da organização:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRoleUserInOrg = async (orgId, userId, role) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/v1/org/${orgId}/users/${userId}`, {
        role,
      });
      return data;
    } catch (err) {
      console.error('Erro ao atualizar papel do usuário na organização:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  return {
    orgs,
    loading,
    error,
  };
};
