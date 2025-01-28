'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export function QuickStats() {
  const [githubUser, setGithubUser] = useState<any>(null);
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchGithubData = async () => {
      if (!user) return;

      const githubAccount = user.externalAccounts?.find(
        (account) => account.provider === 'github'
      );

      if (githubAccount?.verification?.status === 'verified') {
        try {
          const token = await getToken({ template: 'oauth_github' });
          if (!token) return;

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
        }
      }
    };

    fetchGithubData();
  }, [user, getToken]);

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
