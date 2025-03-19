import { useEffect, useState } from 'react';
import axios from 'axios';

export const useModel = () => {
  const [modelList, setModelList] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newModel, setNewModel] = useState({
    title: '',
    content: '',
  });

  const saveModel = async (model) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/model', model);
      setModelList(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar modelo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateModel = async (updatedModel) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/v1/model/${updatedModel.id}`, updatedModel);
      setModelList(prev => 
        prev.map(model => model.id === data.id ? data : model)
      );
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
      setModelList(prev => prev.filter(model => model.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao excluir modelo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/v1/models');
      setModelList(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar modelos');
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
    fetchModels,
    selectModel: (id) => {
      const model = modelList.find(m => m.id.toString() === id.toString());
      setSelectedModel(model || null);
    },
    saveModel,
    updateModel,
    deleteModel,
    newModel,
    setNewModel,
  }
};

export default useModel;