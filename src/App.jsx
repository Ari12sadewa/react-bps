// src/App.jsx
import React, { use } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import PublicationListPage from "./components/PublicationListPage";
import AddPublicationPage from "./components/AddPublicationPage";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import EditPublicationPage from "./components/EditPublicationPage";
import Register from './components/RegisterPage';
import { useAuth } from "./hooks/useAuth";
import { usePublications } from "./hooks/usePublications";
export default function App() {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const { error, clearError } = usePublications();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/publications"
          element={
            <ProtectedRoute redirectTo="/login">
              <PublicationListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/publications/add"
          element={
            <ProtectedRoute redirectTo="/login">
              <AddPublicationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/publications/edit/:id"
          element={
            <ProtectedRoute redirectTo="/login">
              <EditPublicationPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect Routes */}
        <Route path="/" element={<Navigate to="/publications" replace />} />
        <Route path="*" element={<Navigate to="/publications" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}