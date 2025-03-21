import { pool } from '../db';

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM users
      WHERE email = $1 AND password = $2`,
      [email, password]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
