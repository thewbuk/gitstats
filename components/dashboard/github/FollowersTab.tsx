'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useGithubAuth } from '@/components/providers/github-auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';

interface GithubFollower {
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
}

export const FollowersTab = () => {
  const { isAuthenticated, token } = useGithubAuth();
  const [followers, setFollowers] = useState<GithubFollower[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchFollowers();
    }
  }, [isAuthenticated, token]);

  const fetchFollowers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.github.com/user/followers', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      if (!response.ok) {
        throw new Error(
          'Failed to fetch followers. You might need additional scopes.'
        );
      }
      const data = await response.json();
      setFollowers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch followers:', error);
      setFollowers([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GitHub Followers</CardTitle>
          <CardDescription>
            Login with GitHub (recommended) or a token with
            &apos;read:user&apos; scope to see your followers
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Followers</CardTitle>
        <CardDescription>People following your work</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))
          ) : followers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No followers yet</p>
          ) : (
            followers.map((follower) => (
              <div
                key={follower.login}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={follower.avatar_url}
                    alt={follower.login}
                    className="h-10 w-10 rounded-full"
                  />
                  <span className="font-medium">{follower.login}</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href={follower.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
