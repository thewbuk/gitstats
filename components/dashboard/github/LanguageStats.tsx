'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
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
import { useGithubAuth } from '@/components/providers/github-auth-provider';
import { Skeleton } from '@/components/ui/skeleton';

interface LanguageData {
  language: string;
  bytes: number;
  fill: string;
}

const colors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const chartConfig = {
  bytes: {
    label: 'Bytes',
  },
} satisfies ChartConfig;

export function LanguageStats() {
  const { isAuthenticated, token } = useGithubAuth();
  const [loading, setLoading] = useState(false);
  const [languageData, setLanguageData] = useState<LanguageData[]>([]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchLanguageStats();
    }
  }, [isAuthenticated, token]);

  const fetchLanguageStats = async () => {
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

      // Get languages for each repo
      const languagePromises = repos.map(async (repo: any) => {
        const response = await fetch(
          `https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`,
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

      const languages = await Promise.all(languagePromises);

      // Combine and process language data
      const languageTotals = languages.reduce(
        (acc: Record<string, number>, curr) => {
          Object.entries(curr).forEach(([lang, bytes]) => {
            acc[lang] = (acc[lang] || 0) + (bytes as number);
          });
          return acc;
        },
        {}
      );

      // Convert to array and sort by bytes
      const sortedData = Object.entries(languageTotals)
        .map(([language, bytes], index) => ({
          language,
          bytes,
          fill: colors[index % colors.length],
        }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 5); // Top 5 languages

      setLanguageData(sortedData);
    } catch (error) {
      console.error('Failed to fetch language stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Language Distribution</CardTitle>
          <CardDescription>Login to see your language stats</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Distribution</CardTitle>
        <CardDescription>
          Top 5 most used languages across your repositories
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              data={languageData}
              layout="vertical"
              margin={{ left: 80 }}
              className="h-[250px] w-full"
            >
              <YAxis
                dataKey="language"
                type="category"
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <XAxis
                type="number"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={(props) => (
                  <ChartTooltipContent className="bg-background">
                    {props.payload?.[0]?.value
                      ? `${(Number(props.payload[0].value) / 1000).toFixed(1)}K bytes`
                      : ''}
                  </ChartTooltipContent>
                )}
              />
              <Bar
                dataKey="bytes"
                radius={[4, 4, 4, 4]}
                fill="hsl(var(--background))"
                background={{ fill: 'fill' }}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
