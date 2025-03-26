import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import knex from 'knex';
import dbconfig from '../configs/knexfile.js';

const db = knex(dbconfig);

export const LoginOverlord = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db('users').where({ username }).first();

    if (!result) {
      return res.status(401).json({
        error: { message: 'Usuário não encontrado', code: 'user_not_found' },
      });
    }

    const match = await bcrypt.compare(password, result.password);
    if (!match) {
      return res.status(401).json({
        error: { message: 'Senha inválida', code: 'invalid_password' },
      });
    }

    if (result.role !== 'overlord') {
      return res.status(401).json({
        error: {
          message: 'Usuário não é super administrador',
          code: 'not_overlord',
        },
      });
    }

    const token = jwt.sign(
      { id: result.id, role: result.role },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(200).json({ message: 'Autenticado com sucesso', token });
  } catch (error) {
    console.error('Erro ao autenticar:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db('users').where({ username }).first();

    if (!result) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const match = await bcrypt.compare(password, result.password);
    if (!match) {
      return res.status(401).json({ message: 'Senha inválida' });
    }

    const userIsOrgs = await db('user_is_orgs')
      .where({ user_id: result.id })
      .first();

    if (!userIsOrgs) {
      return res.status(401).json({ message: 'Usuário sem organização' });
    }

    const token = jwt.sign(
      {
        id: result.id,
        role: result.role,
        roleIsOrg: userIsOrgs.role,
        orgId: userIsOrgs.org_id,
      },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(200).json({ message: 'Autenticado com sucesso', token });
  } catch (error) {
    console.error('Erro ao autenticar:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getUserData = async (req, res) => {
  const { id } = req.user;

  try {
    const result = await db('users as u')
      .join('user_is_orgs as uo', 'u.id', '=', 'uo.user_id')
      .join('orgs as o', 'uo.org_id', '=', 'o.id')
      .select(
        'u.email',
        'uo.role',
        'o.name as org_name',
        'u.email',
        'u.id',
        'u.name'
      )
      .where('u.id', id)
      .first();

    if (!result) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return res.status(500).json({ message: error.message });
  }
};
