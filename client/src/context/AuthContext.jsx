import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('exampulse_token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const saveToken = (newToken) => {
        if (newToken) {
            localStorage.setItem('exampulse_token', newToken);
            setToken(newToken);
        } else {
            localStorage.removeItem('exampulse_token');
            setToken(null);
        }
    };

    const loadCurrentUser = async () => {
        if (!localStorage.getItem('exampulse_token')) {
            setLoading(false);
            return;
        }
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            saveToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCurrentUser();
    }, []);

    const login = async (payload) => {
        const response = await api.post('/auth/login', payload);
        saveToken(response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const register = async (payload) => {
        const response = await api.post('/auth/register', payload);
        saveToken(response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const logout = () => {
        saveToken(null);
        setUser(null);
    };

    const value = useMemo(() => ({
        token,
        user,
        loading,
        login,
        register,
        logout,
        refreshUser: loadCurrentUser,
        isAuthenticated: Boolean(token),
    }), [token, user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
};
