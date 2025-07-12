import React, { useState, useEffect } from "react";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { replace } from "lodash";
import { usePublications } from "../hooks/usePublications";

function BpsLogo() {
    return (
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg/1280px-Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg.png" alt="BPS Logo" className="h-8 w-8" />
    );
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { loginAction, error, loading, clearError } = useAuth();
    const { clearError: clearPublicationError } = usePublications();
    const navigate = useNavigate();

    // Clear errors when component mounts
    useEffect(() => {
        clearError();
        clearPublicationError();
    }, []);

    // Update message when error changes
    useEffect(() => {
        if (error) {
            setMessage('Password atau email salah');
            setSuccess(false);
        }
    }, [error]);

    const validUser = {
        email: "admin@example.com",
        password: "password",
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous messages and errors
        setMessage('');
        setSuccess(false);
        clearError();

        if (!email || !password) {
            setMessage('Email dan password harus diisi!');
            setSuccess(false);
            return;
        }

        try {
            await loginAction(email, password);
            setSuccess(true);
            setMessage('Login berhasil! Mengarahkan ke halaman publications...');
            navigate('/publications', { replace: true });
        } catch (err) {
            // Error handling sudah diatur di useEffect di atas
            console.error('Login failed:', err.message);
        }
    }

    const redirectToRegister = (e) => {
        e.preventDefault();
        navigate('/register', { replace: true });
    }

    function handleForgotPassword(e) {
        e.preventDefault();
        setMessage('Fitur lupa password belum tersedia.');
        setSuccess(false);
    }

    // Clear message when user starts typing
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (message && !isSuccess) {
            setMessage('');
            clearError();
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (message && !isSuccess) {
            setMessage('');
            clearError();
        }
    };

    if(isSuccess) return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <div className="text-green-600 font-semibold text-xl">{message}</div>
        </div>
    );
    
    return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <div className="absolute top-5 right-5"><BpsLogo /></div>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Log in</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">Username</label>
                    <input
                        type="email"
                        id="email"
                        className="bg-gray-200 transition-all duration-300 w-full h-12 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder={validUser.email}
                        disabled={loading}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="bg-gray-200 w-full h-12 transition-all duration-300  rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder={validUser.password}
                            disabled={loading}
                        />
                        <span className={`material-icons ` + `${showPassword ? 'text-gray-900' : 'text-gray-500'}` + ` select-none absolute cursor-pointer right-4 top-3`}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'visibility' : 'visibility_off'}
                        </span>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-12 rounded-lg focus:scale-90 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'} text-white font-semibold transition duration-200`}
                >
                    {loading ? 'Memproses...' : 'Log in'}
                </button>
                {message && (
                    <div className={`mt-4 text-center font-semibold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </div>
                )}
            </form>
            <div className="mt-4 text-center">
                    <p>Belum Punya Akun?
                        <button type="button" onClick={redirectToRegister}
                        className="text-blue-600 hover:underline cursor-pointer hover:scale-99 ml-1">
                            Register
                        </button>
                    </p>
            </div>
            <div className="mt-4 text-center">
                <button
                    onClick={handleForgotPassword}
                    type="button"
                    className="text-blue-600 hover:underline cursor-pointer hover:scale-99"
                >
                    Lupa Password?
                </button>
            </div>
        </div>
    </div>
    );
}