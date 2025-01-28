'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

export function QuickStats() {
  const [githubUser, setGithubUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchGithubData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const githubAccount = user.externalAccounts?.find(
        (account) => account.provider === 'github'
      );

      if (githubAccount?.verification?.status !== 'verified') {
        setIsLoading(false);
        return;
      }

      try {
        const token = await getToken({ template: 'oauth_github' });
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch GitHub user');
        }

        const data = await response.json();
        setGithubUser(data);
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGithubData();
  }, [user, getToken]);

  if (!user) {
    return (
      <Alert>
        <AlertDescription>
          Please sign in to view your GitHub statistics.
        </AlertDescription>
      </Alert>
    );
  }

  const githubAccount = user.externalAccounts?.find(
    (account) => account.provider === 'github'
  );

  if (githubAccount?.verification?.status !== 'verified') {
    return (
      <Alert>
        <AlertDescription className="flex items-center justify-between">
          <span>Connect your GitHub account to view statistics.</span>
          <Button variant="outline" size="sm" onClick={() => user.createExternalAccount({
            strategy: "oauth_github",
            redirectUrl: "/",
          })}>
            <GitHubLogoIcon className="mr-2 h-4 w-4" />
            Connect GitHub
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <div className="animate-pulse">Loading stats...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Repositories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {githubUser?.public_repos || 0}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Followers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{githubUser?.followers || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Following</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{githubUser?.following || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gists</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {githubUser?.public_gists || 0}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
