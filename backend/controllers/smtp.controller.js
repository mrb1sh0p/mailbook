import { pool } from '../db.js';

export const createSmtpConfig = async (req, res) => {
  const { orgId } = req.user;
  const { title, host, port, secure, username, pass } = req.body;

  if (!title || !host || !port || !username || !pass) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO smtp_config 
      (title, host, port, secure, username, pass, org_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [title, host, port, secure, username, pass, orgId]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro no banco de dados:', error);
    return res.status(500).json({ error: 'Erro ao salvar configuração' });
  }
};

export const getSmtpConfigs = async (req, res) => {
  try {
    const { id } = req.user;

    const result = await pool.query(
      `SELECT * FROM smtp_config 
       WHERE org_id IN (SELECT org_id FROM user_is_orgs WHERE user_id = $1)`,
      [id]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar configurações' });
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

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar configuração' });
  }
};

export const updateSmtpConfig = async (req, res) => {
  const { title, host, port, secure, username, pass } = req.body;

  try {
    const hashedPass = pass ? await bcrypt.hash(pass, 10) : undefined;

    const result = await pool.query(
      `UPDATE smtp_config 
      SET title = $1, host = $2, port = $3, secure = $4, username = $5, 
          pass = $6
      WHERE id = $7
      RETURNING *`,
      [title, host, port, secure, username, hashedPass, req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar configuração' });
  }
};

// Deletar configuração SMTP
export const deleteSmtpConfig = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM smtp_config WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    return res
      .status(200)
      .json({ message: 'Configuração deletada com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar configuração' });
  }
};
