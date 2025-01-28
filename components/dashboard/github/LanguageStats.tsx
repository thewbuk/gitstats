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

type LanguageStatsProps = {
  token?: string;
};

export const LanguageStats = ({ token: externalToken }: LanguageStatsProps) => {
  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchLanguages = async () => {
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
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();
        const languagePromises = repos.map(async (repo: any) => {
          const langResponse = await fetch(repo.languages_url, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: 'application/vnd.github.v3+json',
              'X-GitHub-Api-Version': '2022-11-28',
            },
          });
          return await langResponse.json();
        });

        const languagesData = await Promise.all(languagePromises);
        const languageStats = calculateLanguageStats(languagesData);
        setLanguages(languageStats);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
      }
    };

    fetchLanguages();
  }, [user, getToken, externalToken]);

  if (!user) {
    const mockLanguages = [
      { name: 'JavaScript', value: 45000, color: '#f1e05a' },
      { name: 'TypeScript', value: 35000, color: '#2b7489' },
      { name: 'Python', value: 25000, color: '#3572A5' },
      { name: 'Rust', value: 15000, color: '#dea584' },
      { name: 'Go', value: 10000, color: '#00ADD8' },
    ];

    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Language Distribution (Demo)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockLanguages}
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
                  {mockLanguages.map((entry, index) => (
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
};
