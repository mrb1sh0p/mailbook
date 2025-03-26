import knex from 'knex';
import dbconfig from '../configs/knexfile.js';

const db = knex(dbconfig);

export const createSmtpConfig = async (req, res) => {
  const { orgId } = req.user;
  const { title, host, port, secure, username, pass } = req.body;

  if (!title || !host || !port || !username || !pass) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const [newConfig] = await db('smtp_config')
      .insert({ title, host, port, secure, username, pass, org_id: orgId })
      .returning('*');

    return res.status(201).json(newConfig);
  } catch (error) {
    console.error('Erro no banco de dados:', error);
    return res.status(500).json({ error: 'Erro ao salvar configuração' });
  }
};

export const getSmtpConfigs = async (req, res) => {
  try {
    const { id } = req.user;

    const configs = await db('smtp_config').whereIn(
      'org_id',
      db('user_is_orgs').select('org_id').where('user_id', id)
    );

    return res.status(200).json(configs);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return res.status(500).json({ error: 'Erro ao buscar configurações' });
  }
};

export const getSmtpConfigById = async (req, res) => {
  try {
    const { id } = req.params;

    const config = await db('smtp_config').where('id', id).first();

    if (!config) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    return res.json(config);
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    return res.status(500).json({ error: 'Erro ao buscar configuração' });
  }
};

export const updateSmtpConfig = async (req, res) => {
  const { title, host, port, secure, username, pass } = req.body;
  const { id } = req.params;

  if (!title || !host || !port || !username || !pass) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const [updatedConfig] = await db('smtp_config')
      .where('id', id)
      .update({ title, host, port, secure, username, pass })
      .returning('*');

    if (!updatedConfig) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    return res.json(updatedConfig);
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    return res.status(500).json({ error: 'Erro ao atualizar configuração' });
  }
};

export const deleteSmtpConfig = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedConfig = await db('smtp_config')
      .where('id', id)
      .del()
      .returning('*');

    if (!deletedConfig.length) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    return res
      .status(200)
      .json({ message: 'Configuração deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar configuração:', error);
    return res.status(500).json({ error: 'Erro ao deletar configuração' });
  }
};
