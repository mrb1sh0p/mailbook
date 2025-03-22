import { pool } from '../db.js';

export const addUserToOrg = async (req, res) => {
  try {
    const { id, orgId } = req.params;
    await pool.query(
      'INSERT INTO user_is_orgs (user_id, org_id) VALUES ($1, $2)',
      [id, orgId]
    );
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateRoleUserInOrg = async (req, res) => {
  try {
    const { id, orgId } = req.params;
    const { role } = req.body;
    await pool.query(
      'UPDATE user_is_orgs SET role = $1 WHERE user_id = $2 AND org_id = $3',
      [role, id, orgId]
    );
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeUserFromOrg = async (req, res) => {
  try {
    const { id, orgId } = req.params;
    await pool.query(
      'DELETE FROM user_is_orgs WHERE user_id = $1 AND org_id = $2',
      [id, orgId]
    );
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrgsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT orgs.* FROM orgs JOIN user_is_orgs ON orgs.id = user_is_orgs.org_id WHERE user_is_orgs.user_id = $1',
      [id]
    );
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUsersByOrg = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT users.* FROM users JOIN user_is_orgs ON users.id = user_is_orgs.user_id WHERE user_is_orgs.org_id = $1',
      [id]
    );
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrgs = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orgs');
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrgById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM orgs WHERE id = $1', [id]);
    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createOrg = async (req, res) => {
  try {
    const { name } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO orgs (name) VALUES ($1) RETURNING *',
      [name]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateOrg = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const { rows } = await pool.query(
      'UPDATE orgs SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteOrg = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM orgs WHERE id = $1', [id]);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
