import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSMTP = () => {
  const [smtpList, setSmtpList] = useState([]);
  const [selectedSmtp, setSelectedSmtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  
  const fetchSMTPConfigs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/v1/smtp');
      setSmtpList(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const saveSMTPConfig = async (config) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/smtp', config);
      setSmtpList((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar configuração');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectSMTPConfig = (id) => {
    const config = smtpList.find((c) => c.id.toString() === id.toString());
    setSelectedSmtp(config || null);
  };

  const resetSelectedConfig = () => {
    setSelectedSmtp(null);
  };

  const updateSMTPConfig = (updatedConfig) => {
    setSmtpList((prev) =>
      prev.map((config) =>
        config.id === updatedConfig.id ? updatedConfig : config
      )
    );
    if (selectedSmtp?.id === updatedConfig.id) {
      setSelectedSmtp(updatedConfig);
    }
  };

  const deleteSMTPConfig = async (id) => {
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
    fetchSMTPConfigs();
  }, []);

  return {
    smtpList,
    selectedSmtp,
    loading,
    error,
    resetSelectedConfig,
    selectSMTPConfig,
    saveSMTPConfig,
    updateSMTPConfig,
    deleteSMTPConfig,
    fetchSMTPConfigs,
  };
};
