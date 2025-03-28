import axios from 'axios';
import { useState } from 'react';

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export const useUser = () => {
  const [loading, setLoading] = useState(false);

  const getDataUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/v1/userdata');
      return data;
    } catch (err) {
      console.error('Erro ao carregar usuário:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const userByOrgs = async (userId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/user/orgs/${userId}`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar usuários por organização:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const selectUserByCpf = async (cpf) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/users/cpf/${cpf}`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (user) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/users', user);
      return data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return null;
    }
  };

  const updateUser = async (user) => {
    try {
      setLoading(true);
      await axios.put(`/api/v1/users/${user.id}`, user);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/v1/users/${id}`);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    getDataUser,
    deleteUser,
    updateUser,
    createUser,
    selectUserByCpf,
    userByOrgs,
    loading,
  };
};
