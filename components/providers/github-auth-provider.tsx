'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { useAuth } from '@clerk/nextjs';

interface GithubAuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => Promise<void>;
    logout: () => void;
    validateToken: (token: string) => Promise<boolean>;
}

const GithubAuthContext = createContext<GithubAuthContextType | undefined>(
    undefined
);

export function GithubAuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const { isSignedIn, signOut } = useAuth();

    useEffect(() => {
        const storedToken = localStorage.getItem('github_token');
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
            validateToken(storedToken).then((isValid) => {
                if (!isValid) logout();
            });
        }
    }, []);

    useEffect(() => {
        if (isSignedIn) {
            setIsAuthenticated(true);
        }
    }, [isSignedIn]);

    const validateToken = async (token: string) => {
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    const login = async (newToken: string) => {
        const isValid = await validateToken(newToken);
        if (!isValid) {
            throw new Error('Invalid GitHub token');
        }
        localStorage.setItem('github_token', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        localStorage.removeItem('github_token');
        setToken(null);
        setIsAuthenticated(false);
        if (isSignedIn) {
            await signOut();
        }
    };

    return (
        <GithubAuthContext.Provider
            value={{ isAuthenticated, token, login, logout, validateToken }}
        >
            {children}
        </GithubAuthContext.Provider>
    );
}

export function useGithubAuth() {
    const context = useContext(GithubAuthContext);
    if (context === undefined) {
        throw new Error('useGithubAuth must be used within a GithubAuthProvider');
    }
    return context;
}
