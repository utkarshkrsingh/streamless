import React, { useState } from "react";
import { useTheme } from "./theme-context";
import { FiMail, FiLock, FiEyeOff, FiEye } from 'react-icons/fi';
import { useAuth } from "./AuthContext";  // ✅ import useAuth

type PageProps = {
    setView: (view: 'home' | 'login' | 'signup') => void
};

export default function LoginForm({ setView }: PageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { darkMode } = useTheme();
    const { refreshUser } = useAuth();  // ✅ get refreshUser
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const res = await fetch(apiUrl + "login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert("Login failed: " + (errorData.error || "Unknown error"));
                return;
            }

            // ✅ Refresh user context so App knows immediately
            await refreshUser();

            // Switch view to home after login
            setView("home");

        } catch (err) {
            console.error("Login request failed: ", err);
            alert("Something went wrong. Please try again.")
        }
    };

    return (
        <div className={`w-full max-w-sm text-center animate-fade-in ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} p-8 rounded-xl shadow-2xl border`}>
            <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-6`}>Welcome Back!</h2>
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                    <FiMail className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className={`w-full border ${darkMode ? "bg-gray-800 border-gray-700 focus:border-cyan-500 text-white focus:ring-cyan-500/50" : "bg-gray-100 border-gray-300 focus:border-blue-500 text-gray-900 focus:ring-blue-500/50"} placeholder-gray-500 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2`}
                        required
                    />
                </div>
                <div className="relative">
                    <FiLock className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className={`w-full border ${darkMode ? "bg-gray-800 border-gray-700 focus:border-cyan-500 text-white focus:ring-cyan-500/50" : "bg-gray-100 border-gray-300 focus:border-blue-500 text-gray-900 focus:ring-blue-500/50"} placeholder-gray-500 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2`}
                        required
                    />
                    <div
                        className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                        onClick={toggleShowPassword}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </div>
                </div>
                <button
                    type="submit"
                    className={`cursor-pointer w-full ${darkMode ? "bg-cyan-500 hover:bg-cyan-600 hover:shadow-cyan-500/30" : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30"} text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg`}
                >
                    Log In
                </button>
            </form>
        </div>
    );
};
