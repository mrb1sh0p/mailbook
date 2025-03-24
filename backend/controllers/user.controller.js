import { pool } from '../db.js';

export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserByCpf = async (req, res) => {
  try {
    const { cpf } = req.params;
    const { rows } = await pool.query('SELECT * FROM users WHERE cpf = $1', [
      cpf,
    ]);
    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, last_name, email, password, username, cpf, role } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, username, cpf, role, last_name) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, email, password, username, cpf, role, last_name]
    );
    return res.status(201).json({
      ...rows[0],
      password: undefined,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const { rows } = await pool.query(
      'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
      [name, email, password, id]
    );
    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
