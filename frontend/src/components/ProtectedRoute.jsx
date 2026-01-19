import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
const ProtectedRoute = ({ user, loading }) => {
    if (loading) {
        return <div>Sprawdzanie uprawnień...</div>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;