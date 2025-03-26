import bcrypt from 'bcrypt';
import knex from 'knex';
import dbconfig from '../configs/knexfile.js';

const db = knex(dbconfig);

const saltRounds = 10;

// Função para criptografar a senha
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

export const getUsers = async (req, res) => {
  try {
    const users = await db('users');
    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db('users').where('id', id).first();
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserByCpf = async (req, res) => {
  try {
    const { cpf } = req.params;
    const user = await db('users').where('cpf', cpf).first();
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, last_name, email, password, username, cpf, role } = req.body;

    const hashedPassword = await hashPassword(password);

    const [newUser] = await db('users')
      .insert({
        name,
        email,
        password: hashedPassword,
        username,
        cpf,
        role,
        last_name,
      })
      .returning('*');

    return res.status(201).json({
      ...newUser,
      password: undefined,
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const updatedData = {
      name,
      email,
      ...(password && { password: await hashPassword(password) }), 
    };

    const [updatedUser] = await db('users')
      .where('id', id)
      .update(updatedData)
      .returning('*');

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await db('users').where('id', id).del();

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(204).json();
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return res.status(500).json({ message: error.message });
  }
};
