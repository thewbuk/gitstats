'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useAuth } from '@clerk/nextjs';

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  name: string;
  login: string;
}

// Base component for displaying stats
const StatsDisplay = ({ stats }: { stats: GitHubUser | null }) => {
  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Public Repos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.public_repos}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Followers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.followers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Following</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.following}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Username</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.login}</div>
        </CardContent>
      </Card>
    </div>
  );
};

// Component for token-based auth
export const TokenQuickStats = ({ token }: { token: string }) => {
  const [stats, setStats] = useState<GitHubUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://api.github.com/user', {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `Bearer ${token}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return <StatsDisplay stats={stats} />;
};

// Component for Clerk auth
export const ClerkQuickStats = () => {
  const [stats, setStats] = useState<GitHubUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        const githubAccount = user.externalAccounts?.find(
          (account) => account.provider === 'github'
        );

        if (githubAccount?.verification?.status === 'verified') {
          const tokenResponse = await fetch('/api/github/token');
          if (!tokenResponse.ok) {
            throw new Error('Failed to get GitHub token');
          }
          const { token } = await tokenResponse.json();

          const response = await fetch('https://api.github.com/user', {
            headers: {
              Accept: 'application/vnd.github.v3+json',
              Authorization: `Bearer ${token}`,
              'X-GitHub-Api-Version': '2022-11-28',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    };

    fetchStats();
  }, [user, getToken]);

  if (!user) {
    // Mock data for demo
    const mockStats: GitHubUser = {
      public_repos: 15,
      followers: 100,
      following: 50,
      name: 'Demo User',
      login: 'demo',
    };
    return <StatsDisplay stats={mockStats} />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return <StatsDisplay stats={stats} />;
};
