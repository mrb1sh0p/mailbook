import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ProtectedRouteUser from './components/ProtectedRoute';
import ProtectedRouteAdmin from './components/ProtectedRouteOverlord';
import LoginPage from './pages/LoginPage';
import OverlordLogin from './pages/LoginPageOverlord';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'; // Corrigido o import
import { AuthProvider } from './contexts/AuthContext';
import OverlordPage from './pages/admin/OverlordPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin_overlord" element={<OverlordLogin />} />

          <Route element={<ProtectedRouteUser />}>
            <Route path="/app" element={<App />} />
          </Route>

          <Route element={<ProtectedRouteAdmin />}>
            <Route path="/overlord" element={<OverlordPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/app" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
