'use client';
import { Pattern } from '@/components/ui/pattern';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/lib/hooks/use-toast';

export default function GitHubAuthPage() {
    const [token, setToken] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const { toast } = useToast();

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
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `Bearer ${tokenToValidate}`,
                    'X-GitHub-Api-Version': '2022-11-28'
                },
            });

            const data = await response.json();

            if (response.ok) {
                setIsValid(true);
                setUserData(data);
                localStorage.setItem('github_token', tokenToValidate);
                toast({
                    title: 'Success',
                    description: 'GitHub token validated successfully',
                });
            } else {
                setIsValid(false);
                toast({
                    title: 'Error',
                    description: data.message || 'Invalid GitHub token',
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
            <div>
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
            <Dashboard userName={userData?.login} token={token} />
        </>
    );
} 