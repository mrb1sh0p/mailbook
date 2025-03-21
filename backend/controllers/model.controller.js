export const createEmailModel = async (req, res) => {
  const { title, content } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO email_model (title, content)
      VALUES ($1, $2) RETURNING *`,
      [title, content]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro no banco de dados:', error);
    return res.status(500).json({
      error: 'Erro ao salvar modelo',
      details: error.message,
    });
  }
};

export const getEmailModels = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM email_model ORDER BY id');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getEmailModelById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM email_model WHERE id = $1', [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Modelo não encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateEmailModel = async (req, res) => {
  const { title, content } = req.body;

  try {
    const result = await pool.query(
      `UPDATE email_model
      SET title = $1, content = $2
      WHERE id = $3 RETURNING *`,
      [title, content, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Modelo não encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro no banco de dados:', error);
    return res.status(500).json({
      error: 'Erro ao atualizar modelo',
      details: error.message,
    });
  }
};

export const deleteEmailModel = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM email_model WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Modelo não encontrado' });
    }

    return res.json({
      message: 'Modelo excluído com sucesso',
      deleted: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
