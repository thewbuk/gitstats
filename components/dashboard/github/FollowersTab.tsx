'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useAuth } from '@clerk/nextjs';

interface GithubFollower {
  login: string;
  avatar_url: string;
  html_url: string;
}

export function FollowersTab() {
  const [followers, setFollowers] = useState<GithubFollower[]>([]);
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchFollowers = async () => {
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

          const response = await fetch('https://api.github.com/user/followers', {
            headers: {
              Authorization: `token ${token}`,
              Accept: 'application/vnd.github.v3+json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch followers');
          }

          const data = await response.json();
          setFollowers(data);
        } catch (error) {
          console.error('Failed to fetch followers:', error);
        }
      }
    };

    fetchFollowers();
  }, [user, getToken]);

  if (!user) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Please sign in to view your followers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {followers.map((follower) => (
        <div key={follower.login} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={follower.avatar_url} alt={follower.login} />
            <AvatarFallback>{follower.login[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              <a
                href={follower.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {follower.login}
              </a>
            </p>
          </div>
        </div>
      ))}
      {followers.length === 0 && (
        <p className="text-sm text-muted-foreground">No followers found.</p>
      )}
    </div>
  );
}
