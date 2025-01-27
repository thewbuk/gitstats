'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, Video, History, Lock } from 'lucide-react';
import { useGithubAuth } from '@/components/providers/github-auth-provider';

interface GithubStats {
  repoCount: number;
  followerCount: number;
  contributionCount: number;
  commitCount: number;
}

export const QuickStats = () => {
  const { isAuthenticated, token } = useGithubAuth();
  const [stats, setStats] = useState<GithubStats>({
    repoCount: 0,
    followerCount: 0,
    contributionCount: 0,
    commitCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchGithubStats(token);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const fetchGithubStats = async (token: string) => {
    try {
      // Fetch user data
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      const userData = await userResponse.json();

      // Fetch all repos with pagination
      let page = 1;
      let allRepos: any[] = [];
      while (true) {
        const reposResponse = await fetch(
          `https://api.github.com/user/repos?per_page=100&page=${page}&affiliation=owner,collaborator,organization_member&visibility=all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );
        const repos = await reposResponse.json();
        if (!Array.isArray(repos) || repos.length === 0) break;
        allRepos = [...allRepos, ...repos];
        page++;
      }

      console.log('Total repos found:', allRepos.length); // Debug log

      setStats({
        repoCount: allRepos.length,
        followerCount: userData.followers,
        contributionCount: allRepos.filter((repo: any) => !repo.fork).length,
        commitCount: allRepos.reduce(
          (acc: number, repo: any) => acc + repo.size,
          0
        ),
      });
    } catch (error) {
      console.error('Failed to fetch GitHub stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    {
      title: 'Repositories',
      value: isAuthenticated ? stats.repoCount : '?',
      icon: CalendarDays,
    },
    {
      title: 'Followers',
      value: isAuthenticated ? stats.followerCount : '?',
      icon: Users,
    },
    {
      title: 'Contributions',
      value: isAuthenticated ? stats.contributionCount : '?',
      icon: Video,
    },
    {
      title: 'Total Commits',
      value: isAuthenticated ? stats.commitCount : '?',
      icon: History,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {statsConfig.map((stat) => (
        <Card
          key={stat.title}
          className={`group hover:border-primary/50 transition-colors ${!isAuthenticated ? 'opacity-80' : ''}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {isAuthenticated ? (
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold animate-pulse">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stat.value}</div>
                {!isAuthenticated && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Login to view your stats
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
