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
import { useAuth, useClerk } from '@clerk/nextjs';
import { Separator } from '@/components/ui/separator';

export const GithubAuth = () => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, login, logout } = useGithubAuth();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

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
      setError(
        error instanceof Error ? error.message : 'Authentication failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthClick = () => {
    openSignIn({
      redirectUrl: `${window.location.origin}/sso-callback`,
      appearance: {
        elements: {
          rootBox: 'w-full',
          card: 'w-full',
        },
      },
    });
    setIsOpen(false);
  };

  if (isAuthenticated) {
    return (
      <Button variant="outline" onClick={logout}>
        Disconnect GitHub
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Connect GitHub</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] z-[9999]">
        <DialogHeader>
          <DialogTitle>GitHub Authentication</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Button
            variant="outline"
            className="w-full flex items-center"
            onClick={handleOAuthClick}
          >
            <Github className="mr-2 h-4 w-4" />
            {isSignedIn ? 'Connect GitHub Account' : 'Sign in with GitHub'}
          </Button>

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
                <li>Click &quot;Generate new token&quot;</li>
                <li>Set a token name and expiration</li>
                <li>
                  Under &quot;Repository access&quot; select &quot;All
                  repositories&quot;
                </li>
                <li>
                  Under &quot;Permissions&quot; expand &quot;Repository
                  permissions&quot; and set:
                  <ul className="list-disc list-inside ml-4 text-xs space-y-1">
                    <li className="font-medium">Required scopes:</li>
                    <li>
                      Contents: <span className="font-semibold">Read-only</span>
                    </li>
                    <li>
                      Metadata: <span className="font-semibold">Read-only</span>
                    </li>
                    <li className="font-medium mt-2">
                      Optional scopes for full features:
                    </li>
                    <li>
                      Followers:{' '}
                      <span className="font-semibold">Read-only</span>
                    </li>
                    <li>
                      Pull requests:{' '}
                      <span className="font-semibold">Read-only</span>
                    </li>
                    <li>
                      Issues: <span className="font-semibold">Read-only</span>
                    </li>
                    <li>
                      Commit statuses:{' '}
                      <span className="font-semibold">Read-only</span>
                    </li>
                    <li>
                      Repository hooks:{' '}
                      <span className="font-semibold">Read-only</span>
                    </li>
                  </ul>
                </li>
                <li>Click &quot;Generate token&quot;</li>
                <li>
                  Copy and paste the token here (you won&apos;t see it again)
                </li>
              </ol>
              <p className="text-xs mt-2 text-yellow-500">
                Note: Using GitHub OAuth login (recommended) will automatically
                set correct permissions
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
                'Connect with Token'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
