import { pool } from '../db.js';

export const createSmtpConfig = async (req, res) => {
  const { title, host, port, secure, username, pass } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO smtp_config 
      (title, host, port, secure, username, pass) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [title, host, port, secure, username, pass]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro no banco de dados:', error);
    res.status(500).json({ 
      error: 'Erro ao salvar configuração',
      details: error.message
    });
  }
};

export const getSmtpConfigs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM smtp_config');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSmtpConfigById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM smtp_config WHERE id = $1', [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};