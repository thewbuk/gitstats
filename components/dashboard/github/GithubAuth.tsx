'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const GithubAuth = () => {
    const [token, setToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = async () => {
        if (!token) return;

        try {
            // Store token securely
            localStorage.setItem('github_token', token);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Authentication failed:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('github_token');
        setIsAuthenticated(false);
    };

    return (
        <div>
            {isAuthenticated ? (
                <Button variant="outline" onClick={handleLogout}>
                    Logout
                </Button>
            ) : (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">Login with GitHub</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>GitHub Authentication</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input
                                placeholder="Enter GitHub Personal Access Token"
                                type="password"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                            />
                            <Button onClick={handleLogin} className="w-full">
                                Login
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}; 