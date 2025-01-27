'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { useGithubAuth } from '@/components/providers/github-auth-provider';
import { useAuth, useClerk } from '@clerk/nextjs';

export const GithubAuth = () => {
    const [error, setError] = useState('');
    const { isAuthenticated, isConnected, logout } = useGithubAuth();
    const { isSignedIn } = useAuth();
    const { user, openSignIn } = useClerk();

    const handleOAuthClick = async () => {
        try {
            if (!isSignedIn) {
                openSignIn({
                    redirectUrl: window.location.href,
                    afterSignInUrl: window.location.href,
                });
                return;
            }

            // If not connected, create new connection
            await user?.createExternalAccount({
                strategy: "oauth_github",
                redirectUrl: window.location.href,
            });
        } catch (error) {
            console.error('Failed to connect GitHub:', error);
            setError('Failed to connect GitHub account');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Failed to disconnect GitHub:', error);
            setError(error instanceof Error ? error.message : 'Failed to disconnect GitHub');
        }
    };

    if (isAuthenticated) {
        return (
            <>
                <Button variant="outline" onClick={handleLogout}>
                    Disconnect GitHub
                </Button>
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </>
        );
    }

    return (
        <>
            <Button
                variant="outline"
                className="w-full flex items-center"
                onClick={handleOAuthClick}
                disabled={isConnected}
            >
                <Github className="mr-2 h-4 w-4" />
                {isConnected
                    ? 'GitHub Already Connected'
                    : isSignedIn
                        ? 'Connect GitHub Account'
                        : 'Sign in with GitHub'
                }
            </Button>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </>
    );
};
