'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useAuth } from '@clerk/nextjs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RepoActivity {
  name: string;
  activity: number;
}

export function RepoActivityChart() {
  const [repoActivity, setRepoActivity] = useState<RepoActivity[]>([]);
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchRepoActivity = async () => {
      if (!user) return;

      const githubAccount = user.externalAccounts?.find(
        (account) => account.provider === 'github'
      );

      if (githubAccount?.verification?.status === 'verified') {
        try {
          const token = await getToken();
          if (!token) return;

          const response = await fetch(
            'https://api.github.com/user/repos?sort=updated',
            {
              headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
              },
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch repositories');
          }

          const repos = await response.json();
          const recentRepos = repos
            .slice(0, 10)
            .map((repo: any) => ({
              name: repo.name,
              activity:
                repo.stargazers_count + repo.forks_count + repo.watchers_count,
            }))
            .sort(
              (a: RepoActivity, b: RepoActivity) => b.activity - a.activity
            );

          setRepoActivity(recentRepos);
        } catch (error) {
          console.error('Failed to fetch repo activity:', error);
        }
      }
    };

    fetchRepoActivity();
  }, [user, getToken]);

  if (!user) {
    const mockActivity = [
      { name: 'awesome-project', activity: 120 },
      { name: 'cool-app', activity: 85 },
      { name: 'utils', activity: 65 },
      { name: 'website', activity: 45 },
      { name: 'docs', activity: 30 },
    ];

    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Repository Activity (Demo)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockActivity}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activity" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Repository Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={repoActivity}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="activity" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
