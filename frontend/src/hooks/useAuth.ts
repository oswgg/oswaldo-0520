import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useApi } from './useApi';
import { sessionStorage, localStorageKeys } from '../data/localStorage';
import { RegisterRequest, LoginRequest, AuthResponse } from '@oswaldo/dtos';

export const useAuth = () => {
    const api = useApi();
    const navigate = useNavigate();
    const { user, setUser, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post<AuthResponse>('/auth/login', credentials);

            if (response.success && response.user && response.token) {
                setUser(response.user);
                sessionStorage.setToken(response.token);
                sessionStorage.setUser(response.user);

                // Inicializar balance si no existe
                if (sessionStorage.getBalance() === 0) {
                    sessionStorage.setBalance(0);
                }

                navigate('/dashboard');
            } else {
                setError(response.error || 'Login failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post<AuthResponse>('/auth/register', data);

            if (response.success && response.user && response.token) {
                setUser(response.user);
                sessionStorage.setToken(response.token);
                sessionStorage.setUser(response.user);

                // Inicializar balance en 0 para nuevos usuarios
                sessionStorage.setBalance(0);
                sessionStorage.setTransactions([]);

                navigate('/dashboard');
            } else {
                setError(response.error || 'Registration failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.clearSession();
        localStorage.removeItem(localStorageKeys.BALANCE);
        localStorage.removeItem(localStorageKeys.TRANSACTIONS);
        localStorage.removeItem(localStorageKeys.RACES_HISTORY);
        localStorage.removeItem(localStorageKeys.LAST_RACE_DATE);
        localStorage.removeItem(localStorageKeys.DAILY_RACE_COUNT);
        navigate('/login');
    };

    return {
        user,
        isAuthenticated,
        isLoading: isLoading || isAuthLoading,
        error,
        login,
        register,
        logout,
    };
};
