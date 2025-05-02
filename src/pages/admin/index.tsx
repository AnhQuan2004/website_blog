import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import Dashboard from './Dashboard';
import Users from './Users';
import Blog from './Blog';
import { useAuth } from '@/context/AuthContext';

/**
 * Main admin component that sets up the admin routes
 * This component handles the routing for the admin section
 */
const Admin: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Redirect if not authenticated or not an admin/manager
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="blog" element={<Blog />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin; 