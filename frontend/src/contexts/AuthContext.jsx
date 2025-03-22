import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [overlord, setOverlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getDataUser } = useUser();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setUser(token);
        }

        const overlordToken = localStorage.getItem('overlordToken');
        if (overlordToken) {
          setOverlord(overlordToken);
        }
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [getDataUser]);

  const login = async (credentials) => {
    try {
      const { email, password } = credentials;

      const { data } = await axios.post('/api/v1/login', {
        email,
        password,
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const loginOverlord = async (credentials) => {
    try {
      const { email, password } = credentials;

      const { data } = await axios.post('/api/v1/login/overlord', {
        email,
        password,
      });

      console.log(data);

      if (data.token) {
        localStorage.setItem('overlordToken', data.token);
        setOverlord(data.user);
      }
    } catch (error) {
      console.error('Erro no login overlord:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('overlordToken');
    setUser(null);
    setOverlord(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, overlord, loading, login, logout, loginOverlord }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
