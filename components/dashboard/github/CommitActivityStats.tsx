'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useAuth } from '@clerk/nextjs';

interface CommitStats {
  total: number;
  today: number;
  week: number;
  month: number;
}

type CommitActivityStatsProps = {
  token?: string;
};

export const CommitActivityStats = ({ token: externalToken }: CommitActivityStatsProps) => {
  const [stats, setStats] = useState<CommitStats>({
    total: 0,
    today: 0,
    week: 0,
    month: 0,
  });
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCommitStats = async () => {
      try {
        let authToken = externalToken;

        if (!authToken && user) {
          const githubAccount = user.externalAccounts?.find(
            (account) => account.provider === 'github'
          );

          if (githubAccount?.verification?.status === 'verified') {
            const tokenResponse = await fetch('/api/github/token');
            if (!tokenResponse.ok) {
              throw new Error('Failed to get GitHub token');
            }
            const { token } = await tokenResponse.json();
            authToken = token;
          }
        }

        if (!authToken) return;

        const response = await fetch('https://api.github.com/user/repos', {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28'
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();
        const commitPromises = repos.map(async (repo: any) => {
          const commitResponse = await fetch(
            `https://api.github.com/repos/${repo.full_name}/commits?author=${user?.username}&per_page=100`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: 'application/vnd.github.v3+json',
                'X-GitHub-Api-Version': '2022-11-28'
              },
            }
          );
          if (!commitResponse.ok) return [];
          return await commitResponse.json();
        });

        const commitResults = await Promise.all(commitPromises);
        const allCommits = commitResults.flat();

        // Calculate stats
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        const commitStats = {
          total: allCommits.length,
          today: allCommits.filter(commit => new Date(commit.commit.author.date) >= today).length,
          week: allCommits.filter(commit => new Date(commit.commit.author.date) >= weekAgo).length,
          month: allCommits.filter(commit => new Date(commit.commit.author.date) >= monthAgo).length,
        };

        setStats(commitStats);
      } catch (error) {
        console.error('Failed to fetch commit stats:', error);
      }
    };

    fetchCommitStats();
  }, [user, getToken, externalToken]);

  if (!user) {
    const mockStats = {
      total: 234,
      today: 15,
      week: 2,
      month: 0,
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
              Today's Commits (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.today}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly Commits (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.week}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Commits (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.month}</div>
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
          <CardTitle className="text-sm font-medium">Today's Commits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.today}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Commits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.week}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Commits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.month}</div>
        </CardContent>
      </Card>
    </div>
  );
}
