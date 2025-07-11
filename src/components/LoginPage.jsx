import React, { useState } from "react";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { replace } from "lodash";

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

    const validUser = {
        email: "admin@example.com",
        password: "password",
    };

    const { loginAction, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('email dan password harus diisi!');
            return;
        }

        try {
            await loginAction(email, password);
            setSuccess(true);
            setMessage('Login berhasil! Mengarahkan ke halaman publications...');
            setTimeout(() => {
                navigate('/publications',{replace: true});
            }, 500);
            // Redirect ke publications setelah login berhasil
        } catch (err) {
            setMessage(err.message);
            console.error('Login failed:', err);
        }
    }

    const redirectToRegister = (e) => {
        e.preventDefault();
        navigate('/register', { replace: true });
    }

    function handleForgotPassword(e) {
        e.preventDefault();
        //nooo i have not enough timeeee
        setMessage('Fitur lupa password belum tersedia.');
    }


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
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={validUser.email}

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
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={validUser.password}

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
                    className="w-full h-12 rounded-lg focus:scale-90 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold transition duration-200"
                >
                    Log in
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
