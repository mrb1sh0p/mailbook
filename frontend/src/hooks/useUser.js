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
      const userData = {
        ...data,
        name: data.email.split('@')[0],
        orgName: data.name,
      };
      return userData;
    } catch (err) {
      console.error('Erro ao carregar usuário:', err);
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

  return { getDataUser, createUser, selectUserByCpf, loading };
};
