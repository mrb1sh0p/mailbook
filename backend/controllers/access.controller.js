import { pool } from '../db.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const LoginOverlord = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM users
      WHERE email = $1 AND password = $2`,
      [email, password]
    );

    if (!result.rows.length) {
      return res.status(401).json({
        error: {
          message: 'Usuário ou senha inválidos',
          code: 'invalid_credentials',
        },
      });
    }
    if (result.rows[0].role !== 'overlord') {
      return res.status(401).json({
        error: {
          message: 'Usuário não é super administrador',
          code: 'not_overlord',
        },
      });
    }

    const token = jwt.sign(
      {
        id: result.rows[0].id,
        role: result.rows[0].role,
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
    console.error('Erro ao autenticar:', error);
    res.status(500).json({ message: error.message });
  }
};

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
    console.error('Erro ao autenticar:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserData = async (req, res) => {
  const { id } = req.user;

  try {
    const { rows } = await pool.query(
      `SELECT users.email, user_is_orgs.role, orgs.name
      FROM users
      JOIN user_is_orgs ON users.id = user_is_orgs.user_id
      JOIN orgs ON user_is_orgs.org_id = orgs.id
      WHERE users.id = $1`,
      [id]
    );

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return res.status(500).json({ message: error.message });
  }
};
