import knex from 'knex';
import dbconfig from '../configs/knexfile.js';

const db = knex(dbconfig);

export const createEmailModel = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ error: 'Título e conteúdo são obrigatórios' });
  }

  try {
    const [newModel] = await db('email_model')
      .insert({ title, content })
      .returning('*'); // Retorna o modelo recém-criado

    return res.status(201).json(newModel);
  } catch (error) {
    console.error('Erro no banco de dados:', error);
    return res.status(500).json({
      error: 'Erro ao salvar modelo',
      details: error.message,
    });
  }
};

export const getEmailAllModels = async (req, res) => {
  try {
    const models = await db('email_model').orderBy('id');
    return res.json(models);
  } catch (error) {
    console.error('Erro ao buscar modelos:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const getEmailModels = async (req, res) => {
  const { orgId } = req.user;
  try {
    const models = await db('email_model')
      .where({ org_id: orgId })
      .orderBy('id');
    return res.json(models);
  } catch (error) {
    console.error('Erro ao buscar modelos:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const getEmailModelById = async (req, res) => {
  const { id } = req.params;

  try {
    const model = await db('email_model').where({ id }).first();

    if (!model) {
      return res.status(404).json({ error: 'Modelo não encontrado' });
    }

    return res.json(model);
  } catch (error) {
    console.error('Erro ao buscar modelo:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateEmailModel = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;

  if (!title || !content) {
    return res
      .status(400)
      .json({ error: 'Título e conteúdo são obrigatórios' });
  }

  try {
    const [updatedModel] = await db('email_model')
      .where({ id })
      .update({ title, content })
      .returning('*');

    if (!updatedModel) {
      return res.status(404).json({ error: 'Modelo não encontrado' });
    }

    return res.json(updatedModel);
  } catch (error) {
    console.error('Erro ao atualizar modelo:', error);
    return res.status(500).json({
      error: 'Erro ao atualizar modelo',
      details: error.message,
    });
  }
};

export const deleteEmailModel = async (req, res) => {
  const { id } = req.params;

  try {
    const [deletedModel] = await db('email_model')
      .where({ id })
      .del()
      .returning('*');

    if (!deletedModel) {
      return res.status(404).json({ error: 'Modelo não encontrado' });
    }

    return res.json({
      message: 'Modelo excluído com sucesso',
      deleted: deletedModel,
    });
  } catch (error) {
    console.error('Erro ao excluir modelo:', error);
    return res.status(500).json({ error: error.message });
  }
};
