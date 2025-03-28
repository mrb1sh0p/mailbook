import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useSMTP = () => {
  let token = localStorage.getItem('token');

  const [smtpList, setSmtpList] = useState([]);
  const [selectedSmtp, setSelectedSmtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  axios.defaults.headers.common.Authorization = `Bearer ${token}`;

  const fetchSMTP = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get('/api/v1/smtp');
      setSmtpList(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSMTP = async (config) => {
    setLoading(true);
    setError(null);

    console.log(config);

    try {
      const { data } = await axios.post('/api/v1/smtp', config);
      console.log(data);
      setSmtpList((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar configuração');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSMTP = async (updatedConfig) => {
    setLoading(true);
    setError(null);

    try {
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
    setLoading(true);
    setError(null);

    try {
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

  const selectSMTP = (id) => {
    if (!id) {
      setSelectedSmtp(null);
      return;
    }
    const config = smtpList.find((c) => c.id.toString() === id.toString());
    setSelectedSmtp(config || null);
  };

  useEffect(() => {
    fetchSMTP();
  }, [fetchSMTP]);

  return {
    smtpList,
    selectedSmtp,
    loading,
    error,
    setLoading,
    selectSMTP,
    saveSMTP,
    updateSMTP,
    deleteSMTP,
    fetchSMTP,
  };
};
