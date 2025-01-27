'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useGithubAuth } from '@/components/providers/github-auth-provider';
import { Skeleton } from '@/components/ui/skeleton';

interface CommitActivity {
  week: number;
  total: number;
  days: number[];
}

const chartConfig = {
  commits: {
    label: 'Commits',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function CommitActivityStats() {
  const { isAuthenticated, token } = useGithubAuth();
  const [loading, setLoading] = React.useState(false);
  const [commitData, setCommitData] = React.useState<
    { date: string; commits: number }[]
  >([]);

  React.useEffect(() => {
    if (isAuthenticated && token) {
      fetchCommitActivity();
    }
  }, [isAuthenticated, token]);

  const fetchCommitActivity = async () => {
    setLoading(true);
    try {
      // First get user's repos
      const reposResponse = await fetch(
        'https://api.github.com/user/repos?per_page=100',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }
      );
      const repos = await reposResponse.json();

      // Get commit activity for each repo
      const activityPromises = repos.slice(0, 5).map(async (repo: any) => {
        const response = await fetch(
          `https://api.github.com/repos/${repo.owner.login}/${repo.name}/stats/commit_activity`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );
        return response.json();
      });

      const activities = await Promise.all(activityPromises);

      // Process and combine the data
      const processedData = activities
        .flat()
        .filter((activity: CommitActivity) => activity && activity.total)
        .map((activity: CommitActivity) => ({
          date: new Date(activity.week * 1000).toISOString().split('T')[0],
          commits: activity.total,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30); // Last 30 days

      setCommitData(processedData);
    } catch (error) {
      console.error('Failed to fetch commit activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commit Activity</CardTitle>
          <CardDescription>Login to see your commit activity</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commit Activity</CardTitle>
        <CardDescription>
          Your commit activity over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={commitData}>
              <defs>
                <linearGradient id="fillCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-commits)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-commits)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="commits"
                type="monotone"
                fill="url(#fillCommits)"
                stroke="var(--color-commits)"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
