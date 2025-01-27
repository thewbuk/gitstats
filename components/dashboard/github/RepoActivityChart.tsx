'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ActivityData {
  date: string;
  issues: number;
  prs: number;
}

const chartConfig = {
  activity: {
    label: 'Activity',
  },
  issues: {
    label: 'Issues',
    color: 'hsl(var(--chart-1))',
  },
  prs: {
    label: 'Pull Requests',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export const RepoActivityChart = () => {
  const { isAuthenticated, token } = useGithubAuth();
  const [timeRange, setTimeRange] = React.useState('30d');
  const [activityData, setActivityData] = React.useState<ActivityData[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated && token) {
      fetchActivity();
    }
  }, [isAuthenticated, token, timeRange]);

  const fetchActivity = async () => {
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
      const topRepos = repos.slice(0, 3);

      const now = new Date();
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date(now.setDate(now.getDate() - days));

      const activities = await Promise.all(
        topRepos.map(async (repo: any) => {
          const [issuesRes, prsRes] = await Promise.all([
            fetch(
              `https://api.github.com/repos/${repo.full_name}/issues?state=all&since=${startDate.toISOString()}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: 'application/vnd.github+json',
                  'X-GitHub-Api-Version': '2022-11-28',
                },
              }
            ),
            fetch(
              `https://api.github.com/repos/${repo.full_name}/pulls?state=all&since=${startDate.toISOString()}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: 'application/vnd.github+json',
                  'X-GitHub-Api-Version': '2022-11-28',
                },
              }
            ),
          ]);

          const [issues, prs] = await Promise.all([
            issuesRes.ok ? issuesRes.json() : [],
            prsRes.ok ? prsRes.json() : [],
          ]);

          return { issues, prs };
        })
      );

      const aggregatedData: ActivityData[] = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayIssues = activities
          .flatMap((a) => a.issues)
          .filter((issue) => issue.created_at.startsWith(dateStr)).length;

        const dayPRs = activities
          .flatMap((a) => a.prs)
          .filter((pr) => pr.created_at.startsWith(dateStr)).length;

        aggregatedData.unshift({
          date: dateStr,
          issues: dayIssues,
          prs: dayPRs,
        });
      }

      setActivityData(aggregatedData);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Repository Activity</CardTitle>
          <CardDescription>Issues and Pull Requests over time</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={activityData}>
            <defs>
              <linearGradient id="fillIssues" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-issues)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-issues)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPRs" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-prs)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-prs)"
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
              dataKey="prs"
              type="natural"
              fill="url(#fillPRs)"
              stroke="var(--color-prs)"
              stackId="a"
            />
            <Area
              dataKey="issues"
              type="natural"
              fill="url(#fillIssues)"
              stroke="var(--color-issues)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
