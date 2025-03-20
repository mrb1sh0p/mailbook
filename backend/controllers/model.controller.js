import { pool } from '../db.js';


export const createEmailModel = async (req, res) => {
  const {title, content} = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO email_model
      (title, content)
      VALUES ($1, $2)
      RETURNING *`,
      [title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro no banco de dados:', error);
    res.status(500).json({
      error: 'Erro ao salvar modelo',
      details: error.message
    });
  }
};

export const getEmailModels = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM email_model');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmailModelById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM email_model WHERE id = $1', [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmailModel = async (req, res) => {
  const {title, content} = req.body;

  try {
    const result = await pool.query(
      `UPDATE email_model
      SET title = $1, content = $2
      WHERE id = $3
      RETURNING *`,
      [title, content, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro no banco de dados:', error);
    res.status(500).json({
      error: 'Erro ao atualizar modelo',
      details: error.message
    });
  }
};

export const deleteEmailModel = async (req, res) => {
  try {
    await pool.query('DELETE FROM email_model WHERE id = $1', [req.params.id]);
    res.json({ message: 'Modelo excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};