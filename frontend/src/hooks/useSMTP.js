import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSMTP = () => {
  const token = localStorage.getItem('token');

  const [smtpList, setSmtpList] = useState([]);
  const [selectedSmtp, setSelectedSmtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  axios.defaults.headers.common.Authorization = `Bearer ${token}`;

  const fetchSMTP = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/v1/smtp');
      console.log({ data });
      setSmtpList(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const saveSMTP = async (config) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/smtp', config);
      setSmtpList((prev) =>
        prev.map((config) => (config.id === data.id ? data : config))
      );
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar configuração');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectSMTP = (id) => {
    const config = smtpList.find((c) => c.id.toString() === id.toString());
    setSelectedSmtp(config || null);
  };

  const updateSMTP = async (updatedConfig) => {
    try {
      setLoading(true);
      console.log({ updateSMTP });

      const { data } = await axios.put(
        `/api/v1/smtp/${updatedConfig.id}`,
        updatedConfig
      );

      setSmtpList((prev) =>
        prev.map((config) => (config.id === data.id ? data : config))
      );

      if (selectedSmtp?.id === data.id) {
        setSelectedSmtp(data);
      }

      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao atualizar configuração');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSMTP = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/v1/smtp/${id}`);
      setSmtpList((prev) => prev.filter((config) => config.id !== id));
      if (selectedSmtp?.id === id) {
        setSelectedSmtp(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao deletar configuração');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSMTP();
  }, []);

  return {
    smtpList,
    selectedSmtp,
    loading,
    error,
    selectSMTP,
    saveSMTP,
    updateSMTP,
    deleteSMTP,
    fetchSMTP,
  };
};
