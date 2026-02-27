import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * AdminRoute — renders children only for admin users.
 * Redirects to / if not logged in or not an admin.
 */
const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
