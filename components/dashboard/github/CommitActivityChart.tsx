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

type CommitActivityChartProps = {
  token?: string;
};

export const CommitActivityChart = ({ token }: CommitActivityChartProps) => {
  const [commitData, setCommitData] = useState<any[]>([]);
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCommitActivity = async () => {
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
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
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
                  Authorization: `Bearer ${token}`,
                  Accept: 'application/vnd.github+json',
                  'X-GitHub-Api-Version': '2022-11-28',
                },
              }
            );
            if (!commitResponse.ok) return null;
            const commitStats = await commitResponse.json();
            return {
              name: repo.name,
              commits: commitStats.owner.reduce(
                (a: number, b: number) => a + b,
                0
              ),
            };
          });

          const commitResults = await Promise.all(commitPromises);
          setCommitData(
            commitResults.filter(Boolean).sort((a, b) => b.commits - a.commits)
          );
        } catch (error) {
          console.error('Failed to fetch commit activity:', error);
        }
      }
    };

    fetchCommitActivity();
  }, [user, getToken]);

  if (!user) {
    const mockData = [
      { name: 'project-a', commits: 45 },
      { name: 'project-b', commits: 32 },
      { name: 'project-c', commits: 28 },
      { name: 'project-d', commits: 15 },
      { name: 'project-e', commits: 8 },
    ];

    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Commit Activity (Demo)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="commits" fill="#8884d8" />
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
        <CardTitle>Commit Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commitData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="commits" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
