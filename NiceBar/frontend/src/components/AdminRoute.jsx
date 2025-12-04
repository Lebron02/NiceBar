import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Weryfikacja uprawnień...</div>;

    return (user && user.role === 'admin') ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;