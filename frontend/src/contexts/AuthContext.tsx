import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@oswaldo/dtos';
import { sessionStorage } from '../data/localStorage';

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = !!user;

    useEffect(() => {
        const token = sessionStorage.getToken();
        const savedUser = sessionStorage.getUser<User>();

        if (token && savedUser) {
            setUser(savedUser);
        }
        setIsLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
