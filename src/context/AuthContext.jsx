// src/context/AuthContext.jsx
import React, { createContext, useState } from "react";
import { authService } from "../services/authService";
import { Navigate } from "react-router-dom";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginAction = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login(email, password);
            setUser(response.user);
            setToken(response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
            localStorage.setItem("token", response.token);
            return response;
        } catch (error) {
            console.error("Login error:", error);
            
            // Handle specific error cases
            let errorMessage = "Terjadi kesalahan saat login";
            
            // Check if error has response (from backend)
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                
                if (status === 401) {
                    // Unauthorized - wrong credentials
                    errorMessage = "Password atau email salah";
                } else if (status === 400) {
                    // Bad request - validation errors
                    errorMessage = data.message || "Data yang dimasukkan tidak valid";
                } else if (status === 422) {
                    // Unprocessable entity - validation errors
                    errorMessage = "Password atau email salah";
                } else if (status === 500) {
                    // Server error
                    errorMessage = "Terjadi kesalahan server. Silakan coba lagi.";
                } else {
                    // Other error codes
                    errorMessage = data.message || "Terjadi kesalahan saat login";
                }
            } else if (error.request) {
                // Network error
                errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
            } else {
                // Other errors
                errorMessage = error.message || "Terjadi kesalahan yang tidak diketahui";
            }
            
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logoutAction = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.logout();
            console.log('Logout response:', response);
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            return true;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const registerAction = async (name, email, password, passwordConfirmation) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.register(name, email, password, passwordConfirmation);
            return data;
        } catch (error) {
            console.error("Registration error:", error);
            
            // Handle registration errors similarly
            let errorMessage = "Terjadi kesalahan saat registrasi";
            
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                
                if (status === 409 || status === 400) {
                    // Conflict - email already exists or bad request
                    if (data.message && (data.message.includes('email') || data.message.includes('Email'))) {
                        errorMessage = "Email sudah terdaftar";
                    } else {
                        errorMessage = data.message || "Email sudah terdaftar";
                    }
                } else if (status === 422) {
                    // Validation errors
                    if (data.message && (data.message.includes('email') || data.message.includes('Email'))) {
                        errorMessage = "Email sudah terdaftar";
                    } else {
                        errorMessage = data.message || "Data yang dimasukkan tidak valid";
                    }
                } else if (status === 500) {
                    // Server error
                    errorMessage = "Terjadi kesalahan server. Silakan coba lagi.";
                } else {
                    errorMessage = data.message || "Terjadi kesalahan saat registrasi";
                }
            } else if (error.request) {
                errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
            } else {
                errorMessage = error.message || "Terjadi kesalahan yang tidak diketahui";
            }
            
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        user, 
        token, 
        loginAction, 
        logoutAction,
        registerAction,
        loading, 
        error, 
        clearError
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };