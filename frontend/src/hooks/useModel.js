import { useEffect, useState } from 'react';
import axios from 'axios';

export const useModel = () => {
  const token = localStorage.getItem('token');

  const [modelList, setModelList] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  axios.defaults.headers.common.Authorization = `Bearer ${token}`;

  const [newModel, setNewModel] = useState({
    title: '',
    content: '',
  });

  const fetchModels = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/v1/model');
      setModelList(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar modelos');
      console.error('Erro ao buscar modelos:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveModel = async (model) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/model', model);
      setModelList((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar modelo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectModel = (id) => {
    const model = modelList.find((m) => m.id.toString() === id.toString());
    setSelectedModel(model || null);
  };

  const updateModel = async (updatedModel) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/v1/model/${updatedModel.id}`,
        updatedModel
      );
      fetchModels();
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao atualizar modelo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteModel = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/v1/model/${id}`);
      setModelList((prev) => prev.filter((model) => model.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao excluir modelo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return {
    modelList,
    selectedModel,
    error,
    loading,
    newModel,
    fetchModels,
    selectModel,
    saveModel,
    updateModel,
    deleteModel,
    setNewModel,
  };
};

export default useModel;
