import { pool } from '../db';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM users
      WHERE email = $1 AND password = $2`,
      [email, password]
    );

    if (!result.rows.length) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    if (result.rows[0].role === 'overload') {
      const token = jwt.sign(
        {
          id: result.rows[0].id,
          role: result.rows[0].role,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '2h',
        }
      );

      return res.status(200).json({
        message: 'Autenticado com sucesso como Overlord',
        token,
      });
    }

    const userIsOrgs = await pool.query(
      `SELECT * FROM user_is_orgs
      WHERE user_id = $1`,
      [result.rows[0].id]
    );

    if (!userIsOrgs.rows.length) {
      return res.status(401).json({ message: 'Usuário sem organização' });
    }

    const token = jwt.sign(
      {
        id: result.rows[0].id,
        role: result.rows[0].role,
        roleIsOrg: userIsOrgs.rows[0].role,
        orgId: userIsOrgs.rows[0].org_id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '24h',
      }
    );

    res.status(200).json({
      message: 'Autenticado com sucesso',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
