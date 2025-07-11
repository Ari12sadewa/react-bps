// // src/components/ProtectedRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// const ProtectedRoute = ({ children }) => {
//     const { user } = useAuth();
//     // Jika user tidak login, redirect ke login page
//     // if (!user) {
//     //     return <Navigate to="/register" replace />;
//     // }
//     // Jika user sudah login, tampilkan children
//     return children;
// };
// export default ProtectedRoute;


import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // Redirect ke halaman yang ditentukan (default: login)
        return <Navigate to={redirectTo} replace />;
    }
    
    // Jika token ada, izinkan akses
    return children;
}