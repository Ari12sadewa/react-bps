import React, { useState, useEffect } from "react";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function BpsLogo() {
    return (
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg/1280px-Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg.png" alt="BPS Logo" className="h-8 w-8" />
    );
}

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { registerAction, error, loading, clearError } = useAuth();
    const navigate = useNavigate();

    // Clear errors when component mounts
    useEffect(() => {
        clearError();
    }, []);

    // Update message when error changes
    useEffect(() => {
        if (error) {
            // Map error messages to user-friendly messages
            if (error.includes('Email sudah terdaftar') || error.includes('email already exists') || error.includes('already taken')) {
                setMessage('Email telah digunakan');
            } else if (error.includes('validation') || error.includes('invalid')) {
                setMessage('Data yang dimasukkan tidak valid');
            } else {
                setMessage('Registrasi gagal. Silakan coba lagi.');
            }
            setSuccess(false);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous messages and errors
        setMessage('');
        setSuccess(false);
        clearError();

        // Validasi form
        if (!name || !email || !password || !passwordConfirmation) {
            setMessage('Semua field harus diisi!');
            setSuccess(false);
            return;
        }

        if (password !== passwordConfirmation) {
            setMessage('Password dan konfirmasi password tidak sama!');
            setSuccess(false);
            return;
        }

        if (password.length < 8) {
            setMessage('Password minimal 8 karakter!');
            setSuccess(false);
            return;
        }

        // validasi email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Format email tidak valid!');
            setSuccess(false);
            return;
        }
        
        try {
            await registerAction(name, email, password, passwordConfirmation);
            setSuccess(true);
            setMessage('Registrasi berhasil! Silakan Login');
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 2000);
        } catch (err) {
            console.error('Registration failed:', err);
        }
    }

    const handleRedirectToLogin = (e) => {
        e.preventDefault();
        navigate('/login', { replace: true });
    }

    // Clear message when user starts typing
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (message && !isSuccess) {
            // setMessage('');
            clearError();
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <div className="absolute top-5 right-5"><BpsLogo /></div>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="name">Nama Lengkap</label>
                        <input
                            type="text"
                            id="name"
                            className="bg-gray-200 transition-all duration-300 w-full h-12 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={name}
                            onChange={handleInputChange(setName)}
                            placeholder="Masukkan nama lengkap"
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="bg-gray-200 transition-all duration-300 w-full h-12 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={handleInputChange(setEmail)}
                            placeholder="Masukkan email"
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="bg-gray-200 w-full h-12 transition-all duration-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={password}
                                onChange={handleInputChange(setPassword)}
                                placeholder="Masukkan password (min. 8 karakter)"
                                disabled={loading}
                            />
                            <span className={`material-icons ` + `${showPassword ? 'text-gray-900' : 'text-gray-500'}` + ` select-none absolute cursor-pointer right-4 top-3`}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'visibility' : 'visibility_off'}
                            </span>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="passwordConfirmation">Konfirmasi Password</label>
                        <div className="relative">
                            <input
                                type={showPasswordConfirmation ? "text" : "password"}
                                id="passwordConfirmation"
                                className="bg-gray-200 w-full h-12 transition-all duration-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={passwordConfirmation}
                                onChange={handleInputChange(setPasswordConfirmation)}
                                placeholder="Konfirmasi password"
                                disabled={loading}
                            />
                            <span className={`material-icons ` + `${showPasswordConfirmation ? 'text-gray-900' : 'text-gray-500'}` + ` select-none absolute cursor-pointer right-4 top-3`}
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                            >
                                {showPasswordConfirmation ? 'visibility' : 'visibility_off'}
                            </span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full h-12 focus:scale-95 rounded-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'} text-white font-semibold transition duration-200`}
                    >
                        {loading ? 'Memproses...' : 'Register'}
                    </button>
                    {message && (
                        <div className={`mt-4 text-center font-semibold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </div>
                    )}
                </form>
                <div className="mt-4 text-center">
                    <span className="text-gray-600">Sudah punya akun? </span>
                    <span
                        onClick={handleRedirectToLogin}
                        className="text-blue-600 hover:underline cursor-pointer hover:scale-99"
                    >
                        Login
                    </span>
                </div>
            </div>
        </div>
    );
}