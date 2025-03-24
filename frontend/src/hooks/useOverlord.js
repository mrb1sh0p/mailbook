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
      setError(err.response?.data?.error || 'Erro ao carregar organizações');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createOrg = async (org) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/orgs', org);
      // Atualiza a lista após criar
      await fetchOrgs();
      return data;
    } catch (err) {
      console.error('Erro ao criar organização:', err);
      setError(err.response?.data?.error || 'Erro ao criar organização');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrg = async (org) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/v1/orgs/${org.id}`, org);
      // Atualiza a lista após atualizar
      await fetchOrgs();
      return data;
    } catch (err) {
      console.error('Erro ao atualizar organização:', err);
      setError(err.response?.data?.error || 'Erro ao atualizar organização');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrg = async (orgId) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/v1/orgs/${orgId}`);
      // Atualiza a lista após deletar
      await fetchOrgs();
      return data;
    } catch (err) {
      console.error('Erro ao deletar organização:', err);
      setError(err.response?.data?.error || 'Erro ao deletar organização');
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
      setError(
        err.response?.data?.error || 'Erro ao adicionar usuário à organização'
      );
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
      setError(
        err.response?.data?.error || 'Erro ao remover usuário da organização'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRoleUserInOrg = async (orgId, userId, role) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/v1/orgs/${orgId}/users/${userId}`,
        {
          role,
        }
      );
      return data;
    } catch (err) {
      console.error('Erro ao atualizar papel do usuário na organização:', err);
      setError(
        err.response?.data?.error ||
          'Erro ao atualizar papel do usuário na organização'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getUsersByOrg = async (orgId) => {
    try {
      const { data } = await axios.get(`/api/v1/org/${orgId}/users`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar usuários da organização:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  return {
    orgs,
    loading,
    error,
    selectedOrg,
    getUsersByOrg,
    setSelectedOrg,
    fetchOrgs,
    createOrg,
    updateOrg,
    deleteOrg,
    addUserToOrg,
    removeUserFromOrg,
    updateRoleUserInOrg,
  };
};
