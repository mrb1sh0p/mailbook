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

    if (!result.rows.length) {
      throw new Error('Erro ao salvar configuração');
    }

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro no banco de dados:', error);
    return res.status(500).json({
      error: 'Erro ao salvar configuração',
      details: error.message,
    });
  }
};

export const getSmtpConfigs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM smtp_config');

    if (!result.rows.length) {
      return res.json([]);
    }

    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getSmtpConfigById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM smtp_config WHERE id = $1', [
      req.params.id,
    ]);

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    return res.json(result.rows[0] || {});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
