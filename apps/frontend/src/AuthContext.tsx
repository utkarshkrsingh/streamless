import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
    id: string;
    email: string;
    username: string;
} | null;

type AuthContextType = {
    user: User;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    // Call /validate on mount
    const refreshUser = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const res = await fetch(apiUrl + "validate", {
                method: "GET",
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Validate error:", err);
            setUser(null);
        }
        setLoading(false);
    };

    const logout = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            await fetch(apiUrl + "logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout failed:", err);
        }
        setUser(null);
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
