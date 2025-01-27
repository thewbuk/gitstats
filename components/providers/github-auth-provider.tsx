'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';

interface GithubAuthContextType {
    isAuthenticated: boolean;
    isConnected: boolean;
    logout: () => Promise<void>;
}

const GithubAuthContext = createContext<GithubAuthContextType>({
    isAuthenticated: false,
    isConnected: false,
    logout: async () => { },
});

export const GithubAuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useUser();
    const { signOut } = useClerk();

    useEffect(() => {
        const checkGithubConnection = () => {
            if (!user) {
                setIsConnected(false);
                return;
            }

            const githubAccount = user.externalAccounts?.find(
                (account) => account.provider === 'github'
            );

            setIsConnected(githubAccount?.verification?.status === 'verified');
        };

        checkGithubConnection();
    }, [user]);

    const logout = async () => {
        await signOut();
    };

    return (
        <GithubAuthContext.Provider
            value={{
                isAuthenticated: isConnected,
                isConnected,
                logout,
            }}
        >
            {children}
        </GithubAuthContext.Provider>
    );
};

export const useGithubAuth = () => {
    const context = useContext(GithubAuthContext);
    if (!context) {
        throw new Error('useGithubAuth must be used within a GithubAuthProvider');
    }
    return context;
};
