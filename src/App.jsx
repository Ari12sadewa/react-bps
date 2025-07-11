// src/App.jsx
import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import PublicationListPage from "./components/PublicationListPage";
import AddPublicationPage from "./components/AddPublicationPage";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import EditPublicationPage from "./components/EditPublicationPage";
import Register from './components/RegisterPage';

export default function App() {
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