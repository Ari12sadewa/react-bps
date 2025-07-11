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
            setError(error.message);
            throw error;
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
        try {
            const data = await authService.register(name, email, password, passwordConfirmation);
            return data;
        } catch (error) {
            throw error;
        }finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        user, token, loginAction, logoutAction,registerAction,
        loading, error, clearError
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
export { AuthContext, AuthProvider };