import { useAuth } from '../contexts/AuthContext.jsx';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
