import dbconfig from '../configs/knexfile.js';
import knex from 'knex';

const db = knex(dbconfig);

export const addUserToOrg = async (req, res) => {
  const { id, userId } = req.params;

  // Validação
  if (!userId || !id) {
    return res.status(400).json({ error: 'Parâmetros inválidos' });
  }

  try {
    await db('user_is_orgs').insert({ user_id: userId, org_id: id });
    return res.status(204).json(); // No Content
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateRoleUserInOrg = async (req, res) => {
  const { id, orgId } = req.params;
  const { role } = req.body;

  // Validação
  if (!role || !id || !orgId) {
    return res.status(400).json({ error: 'Parâmetros inválidos' });
  }

  try {
    const updatedUser = await db('user_is_orgs')
      .where({ user_id: id, org_id: orgId })
      .update({ role })
      .returning('*');

    if (!updatedUser.length) {
      return res
        .status(404)
        .json({ error: 'Usuário ou organização não encontrados' });
    }

    return res.status(200).json(updatedUser[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeUserFromOrg = async (req, res) => {
  const { id, orgId } = req.params;

  try {
    const deletedUser = await db('user_is_orgs')
      .where({ user_id: id, org_id: orgId })
      .del()
      .returning('*');

    if (!deletedUser.length) {
      return res
        .status(404)
        .json({ error: 'Usuário ou organização não encontrados' });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrgsByUser = async (req, res) => {
  const { id } = req.params;

  try {
    const orgs = await db('orgs')
      .join('user_is_orgs', 'orgs.id', '=', 'user_is_orgs.org_id')
      .where('user_is_orgs.user_id', id)
      .select('orgs.*');

    return res.status(200).json(orgs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUsersByOrg = async (req, res) => {
  const { id } = req.params;

  try {
    const users = await db('users')
      .join('user_is_orgs', 'users.id', '=', 'user_is_orgs.user_id')
      .where('user_is_orgs.org_id', id)
      .select(
        'users.id',
        'users.name',
        'users.last_name',
        'users.username',
        'users.email',
        'users.password',
        'users.cpf',
        'user_is_orgs.role'
      );

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrgs = async (req, res) => {
  try {
    const orgs = await db('orgs').select('*');
    return res.status(200).json(orgs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrgById = async (req, res) => {
  const { id } = req.params;

  try {
    const org = await db('orgs').where('id', id).first();

    if (!org) {
      return res.status(404).json({ error: 'Organização não encontrada' });
    }

    return res.status(200).json(org);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createOrg = async (req, res) => {
  const { name, address, phone, email, cnpj } = req.body;

  try {
    const [newOrg] = await db('orgs')
      .insert({
        name,
        address,
        phone,
        email,
        cnpj,
      })
      .returning('*');
    return res.status(201).json(newOrg);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateOrg = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const [updatedOrg] = await db('orgs')
      .where('id', id)
      .update({ name })
      .returning('*');

    if (!updatedOrg) {
      return res.status(404).json({ error: 'Organização não encontrada' });
    }

    return res.status(200).json(updatedOrg);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteOrg = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrg = await db('orgs').where('id', id).del().returning('*');

    if (!deletedOrg.length) {
      return res.status(404).json({ error: 'Organização não encontrada' });
    }

    return res.status(204).json(); // No Content
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
