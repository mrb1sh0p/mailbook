import { useAuth } from '../contexts/AuthContext.jsx';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
  const { overlord, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  return overlord ? <Outlet /> : <Navigate to="/login_overlord" replace />;
};

export default ProtectedRoute;
