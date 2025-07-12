// src/components/ProtectedRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// const ProtectedRoute = ({ children }) => {
//     const { user } = useAuth();
//     // Jika user tidak login, redirect ke login page
//     // if (!user) {
//         //     return <Navigate to="/register" replace />;
//         // }
//         // Jika user sudah login, tampilkan children
//         return children;
//     };
//     export default ProtectedRoute;
    

import React, { use } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export default function ProtectedRoute({ children, redirectTo = "/login" }) {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to={redirectTo} replace />;
    }
    return children;
}