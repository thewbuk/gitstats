'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useAuth } from '@clerk/nextjs';

interface CommitStats {
  total: number;
  weekly: number;
  daily: number;
}

export function CommitActivityStats() {
  const [stats, setStats] = useState<CommitStats>({
    total: 0,
    weekly: 0,
    daily: 0,
  });
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCommitStats = async () => {
      if (!user) return;

      const githubAccount = user.externalAccounts?.find(
        (account) => account.provider === 'github'
      );

      if (githubAccount?.verification?.status === 'verified') {
        try {
          const tokenResponse = await fetch('/api/github/token');
          if (!tokenResponse.ok) {
            throw new Error('Failed to get GitHub token');
          }
          const { token } = await tokenResponse.json();
          if (!token) return;

          const response = await fetch('https://api.github.com/user/repos', {
            headers: {
              Authorization: `token ${token}`,
              Accept: 'application/vnd.github.v3+json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch repositories');
          }

          const repos = await response.json();
          const commitPromises = repos.slice(0, 5).map(async (repo: any) => {
            const commitResponse = await fetch(
              `https://api.github.com/repos/${repo.full_name}/stats/participation`,
              {
                headers: {
                  Authorization: `token ${token}`,
                  Accept: 'application/vnd.github.v3+json',
                },
              }
            );
            if (!commitResponse.ok) return null;
            const commitStats = await commitResponse.json();
            return commitStats.owner;
          });

          const commitResults = await Promise.all(commitPromises);
          const validResults = commitResults.filter(Boolean);

          if (validResults.length > 0) {
            const total = validResults.reduce(
              (acc, curr) =>
                acc + curr.reduce((a: number, b: number) => a + b, 0),
              0
            );
            const weekly = validResults.reduce(
              (acc, curr) => acc + curr.slice(-1)[0],
              0
            );
            const daily = Math.round(weekly / 7);

            setStats({
              total,
              weekly,
              daily,
            });
          }
        } catch (error) {
          console.error('Failed to fetch commit stats:', error);
        }
      }
    };

    fetchCommitStats();
  }, [user, getToken]);

  if (!user) {
    const mockStats = {
      total: 234,
      weekly: 15,
      daily: 2,
    };

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Commits (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly Commits (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.weekly}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Daily Average (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.daily}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Commits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.weekly}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.daily}</div>
        </CardContent>
      </Card>
    </div>
  );
}
