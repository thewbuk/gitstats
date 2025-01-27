'use client';

import { Bar, BarChart, XAxis } from 'recharts';
import { useEffect, useState } from 'react';
import { useGithubAuth } from '@/components/providers/github-auth-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface CommitData {
  date: string;
  additions: number;
  deletions: number;
}

const chartConfig = {
  additions: {
    label: 'Additions',
    color: 'hsl(var(--chart-1))',
  },
  deletions: {
    label: 'Deletions',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export const CommitActivityChart = () => {
  const { isAuthenticated, token } = useGithubAuth();
  const [commitData, setCommitData] = useState<CommitData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCommitActivity();
    }
  }, [isAuthenticated, token]);

  const fetchCommitActivity = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch repositories');

      const repos = await response.json();
      const recentCommits = await Promise.all(
        repos.slice(0, 5).map(async (repo: any) => {
          const statsResponse = await fetch(
            `https://api.github.com/repos/${repo.full_name}/stats/commit_activity`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
              },
            }
          );
          if (!statsResponse.ok) return null;
          return statsResponse.json();
        })
      );

      const processedData = recentCommits
        .flat()
        .filter(Boolean)
        .slice(0, 7)
        .map((week: any) => ({
          date: new Date(week.week * 1000).toISOString().split('T')[0],
          additions: week.total * 10, // Approximation for visualization
          deletions: week.total * 5, // Approximation for visualization
        }));

      setCommitData(processedData);
    } catch (error) {
      console.error('Failed to fetch commit activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commit Activity</CardTitle>
        <CardDescription>
          Weekly code changes across repositories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={commitData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString('en-US', {
                  weekday: 'short',
                });
              }}
            />
            <Bar
              dataKey="additions"
              stackId="a"
              fill="var(--color-additions)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="deletions"
              stackId="a"
              fill="var(--color-deletions)"
              radius={[0, 0, 4, 4]}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
