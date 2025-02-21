import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Auth from './components/Auth/Auth';
import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';

import { CircularProgress, Box } from '@mui/material';
const PrivateRoute = ({ children, requireAdmin = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (requireAdmin && user.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return user.role === 'admin' ? (
        <AdminLayout>{children}</AdminLayout>
    ) : (
        <Layout>{children}</Layout>
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/feedback"
                element={
                    <PrivateRoute>
                        <Feedback />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;