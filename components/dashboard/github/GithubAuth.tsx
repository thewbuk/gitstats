'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Github } from 'lucide-react';
import { useGithubAuth } from '@/components/providers/github-auth-provider';
import { SignInButton } from '@clerk/nextjs';
import { Separator } from '@/components/ui/separator';

export const GithubAuth = () => {
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, login, logout } = useGithubAuth();

    const handleLogin = async () => {
        if (!token) {
            setError('Please enter a token');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await login(token);
            setIsOpen(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated) {
        return (
            <Button variant="outline" onClick={logout}>
                Logout
            </Button>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Login with GitHub</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>GitHub Authentication</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <SignInButton mode="modal">
                        <Button variant="outline" className="w-full flex items-center">
                            <Github className="mr-2 h-4 w-4" />
                            Continue with GitHub
                        </Button>
                    </SignInButton>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with token
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>To get your GitHub token:</p>
                            <ol className="list-decimal list-inside space-y-2">
                                <li>
                                    Go to{' '}
                                    <a
                                        href="https://github.com/settings/tokens?type=beta"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        GitHub Fine-grained Token Settings
                                    </a>
                                </li>
                                <li>Click "Generate new token"</li>
                                <li>Set a token name and expiration</li>
                                <li>Under "Repository access" select "All repositories"</li>
                                <li>
                                    Under "Permissions" expand "Repository permissions" and set:
                                    <ul className="list-disc list-inside ml-4 text-xs space-y-1">
                                        <li>
                                            Contents: <span className="font-semibold">Read and write</span>
                                        </li>
                                        <li>
                                            Metadata: <span className="font-semibold">Read-only</span>
                                        </li>
                                    </ul>
                                </li>
                                <li>Click "Generate token"</li>
                                <li>Copy and paste the token here (you won't see it again)</li>
                            </ol>
                            <p className="text-xs mt-2 text-yellow-500">
                                Note: Make sure to select "All repositories" to access private repos
                            </p>
                        </div>
                        <Input
                            placeholder="Enter GitHub Personal Access Token"
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            disabled={isLoading}
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <Button
                            onClick={handleLogin}
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Login with Token'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
