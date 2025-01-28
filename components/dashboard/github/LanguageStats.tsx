'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useAuth } from '@clerk/nextjs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface LanguageData {
  name: string;
  value: number;
  color: string;
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#ff0000',
  '#00ff00',
];

export function LanguageStats() {
  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchLanguages = async () => {
      if (!user) return;

      const githubAccount = user.externalAccounts?.find(
        (account) => account.provider === 'github'
      );

      if (githubAccount?.verification?.status === 'verified') {
        try {
          const token = await getToken({ template: 'oauth_github' });
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
          const languagePromises = repos.map(async (repo: any) => {
            const langResponse = await fetch(
              `https://api.github.com/repos/${repo.full_name}/languages`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: 'application/vnd.github+json',
                  'X-GitHub-Api-Version': '2022-11-28',
                },
              }
            );
            if (!langResponse.ok) return null;
            return langResponse.json();
          });

          const languageResults = await Promise.all(languagePromises);
          const validResults = languageResults.filter(Boolean);

          // Aggregate language data
          const languageTotals = validResults.reduce(
            (acc: Record<string, number>, curr) => {
              Object.entries(curr).forEach(([lang, bytes]) => {
                acc[lang] = (acc[lang] || 0) + (bytes as number);
              });
              return acc;
            },
            {}
          );

          // Convert to chart data format and sort by value
          const chartData = Object.entries(languageTotals)
            .map(([name, value], index) => ({
              name,
              value,
              color: COLORS[index % COLORS.length],
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // Top 10 languages

          setLanguages(chartData);
        } catch (error) {
          console.error('Failed to fetch language stats:', error);
        }
      }
    };

    fetchLanguages();
  }, [user, getToken]);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Language Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={languages}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {languages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
