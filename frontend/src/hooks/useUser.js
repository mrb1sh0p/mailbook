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

  return { getDataUser, loading };
};
