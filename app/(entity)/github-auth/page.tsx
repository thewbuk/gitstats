'use client';
import { Pattern } from '@/components/ui/pattern';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function GitHubAuthPage() {
    const [token, setToken] = useState('');
    const [isValid, setIsValid] = useState(false);
    const { toast } = useToast();

    // Check token validity on mount if exists in localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('github_token');
        if (storedToken) {
            setToken(storedToken);
            validateToken(storedToken);
        }
    }, []);

    const validateToken = async (tokenToValidate: string) => {
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${tokenToValidate}`,
                },
            });

            if (response.ok) {
                setIsValid(true);
                localStorage.setItem('github_token', tokenToValidate);
                toast({
                    title: 'Success',
                    description: 'GitHub token validated successfully',
                });
            } else {
                setIsValid(false);
                toast({
                    title: 'Error',
                    description: 'Invalid GitHub token',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            setIsValid(false);
            toast({
                title: 'Error',
                description: 'Failed to validate token',
                variant: 'destructive',
            });
        }
    };

    if (!isValid) {
        return (
            <div className="container mx-auto max-w-2xl mt-10 p-6 border rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold mb-6">GitHub Authentication</h1>
                <p className="mb-4 text-muted-foreground">
                    To use GitStats, you need to provide a GitHub Personal Access Token with the following scopes:
                    <ul className="list-disc ml-6 mt-2">
                        <li>repo</li>
                        <li>read:user</li>
                        <li>read:org</li>
                    </ul>
                </p>
                <div className="flex gap-2">
                    <Input
                        type="password"
                        placeholder="Enter your GitHub token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                    <Button onClick={() => validateToken(token)}>Validate</Button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                    <a
                        href="https://github.com/settings/tokens/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        Click here
                    </a>
                    {' '}to generate a new GitHub token
                </p>
            </div>
        );
    }

    return (
        <>
            <Pattern variant="checkered" />
            <Dashboard userName={token} />
        </>
    );
} 