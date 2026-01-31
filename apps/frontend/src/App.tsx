import { useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "./theme-context";
import HeroSection from "./HeroSection";
import LoginForm from "./Login";
import SignUpForm from "./SignUp";
import JoinRoom from "./RoomForm";
import RoomArea from "./RoomArea";
import "./App.css";
import { useAuth } from "./AuthContext";

export default function App() {
    const [view, setView] = useState<
        "home" | "login" | "signup" | "joinRoom" | "room"
    >("home");
    const { darkMode, toggleDarkMode } = useTheme();
    const { user, loading, logout } = useAuth();

    const renderView = () => {
        switch (view) {
            case "login":
                return <LoginForm setView={setView} />;
            case "signup":
                return <SignUpForm setView={setView} />;
            case "joinRoom":
                return <JoinRoom setView={setView} />;
            case "room":
                return <RoomArea setView={setView} />;
            case "home":
            default:
                return <HeroSection setView={setView} />;
        }
    };

    return (
        <div
            className={`${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen flex flex-col font-sans`}
        >
            <header
                className={`top-0 z-10 w-full flex flex-row justify-between py-5 px-15 border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}
            >
                <h1
                    onClick={() => setView("home")}
                    className={`cursor-pointer font-sans text-xl tracking-tight md:text-2xl font-bold ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
                >
                    Streamless
                </h1>
                <nav className="flex items-center space-x-2 md:space-x-4">
                    {loading ? (
                        <span
                            className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                            Loading...
                        </span>
                    ) : user ? (
                        <>
                            <span
                                className={`cursor-pointer font-sans ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-blue-600"} text-base px-3 py-2`}
                            >
                                😄 {user.username}
                            </span>
                            <button
                                onClick={() => {
                                    logout();
                                    setView("home");
                                }}
                                className={`cursor-pointer ${darkMode ? "bg-cyan-500 hover:bg-cyan-600" : "bg-blue-600 hover:bg-blue-700"} text-white font-sans font-bold py-3 px-5 rounded-lg text-base`}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setView("login")}
                                className={`cursor-pointer font-sans ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-blue-600"} text-base px-3 py-2`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setView("signup")}
                                className={`cursor-pointer ${darkMode ? "bg-cyan-500 hover:bg-cyan-600" : "bg-blue-600 hover:bg-blue-700"} text-white font-sans font-bold py-3 px-5 rounded-lg text-base`}
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                    <button
                        onClick={toggleDarkMode}
                        className={`cursor-pointer p-2 rounded-full ${darkMode ? "hover:bg-gray-800 hover:text-white" : "text-black hover:bg-gray-200"} ml-2`}
                    >
                        {darkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-row flex items-center justify-center my-auto">
                {renderView()}
            </main>

            {/* Footer */}
            <footer className="w-full text-center">
                <p
                    className={`font-sans text-lg ${darkMode ? "text-gray-600" : "text-gray-500"} `}
                >
                    &copy; {new Date().getFullYear()} Streamless. Built with
                    React and Go
                </p>
            </footer>
        </div>
    );
}
