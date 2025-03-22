import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!process.env.SECRET_KEY) {
      throw new Error('Chave secreta não configurada');
    }

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido. Use: Bearer <token>',
      });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido ou expirado',
          error: error.name,
        });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json({
      status: 401,
      error: 'Authentication failed',
    });
  }
};

export default verifyToken;
