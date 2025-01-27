'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

interface GithubAuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const GithubAuthContext = createContext<GithubAuthContextType>({
  isAuthenticated: false,
  token: null,
  login: async () => {},
  logout: () => {},
});

export const GithubAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get GitHub token from Clerk OAuth
        const githubAccount = user?.externalAccounts?.find(
          (account) => account.provider === 'github'
        );

        if (githubAccount) {
          try {
            const accessToken = await getToken({
              template: 'github_oauth',
            });

            if (accessToken) {
              // Verify the token works
              const response = await fetch('https://api.github.com/user', {
                headers: {
                  Authorization: `token ${accessToken}`,
                  Accept: 'application/vnd.github+json',
                  'X-GitHub-Api-Version': '2022-11-28',
                },
              });

              if (response.ok) {
                setToken(accessToken);
                return;
              }
            }
          } catch (error) {
            console.error('Failed to get GitHub token:', error);
          }
        }

        // If no Clerk GitHub token, try to get from localStorage
        const savedToken = localStorage.getItem('github_token');
        if (savedToken) {
          // Verify the saved token still works
          const response = await fetch('https://api.github.com/user', {
            headers: {
              Authorization: `token ${savedToken}`,
              Accept: 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
            },
          });

          if (response.ok) {
            setToken(savedToken);
          } else {
            localStorage.removeItem('github_token');
          }
        }
      } catch (error) {
        console.error('Failed to initialize GitHub auth:', error);
      }
    };

    if (user) {
      initializeAuth();
    } else {
      setToken(null);
    }
  }, [user, getToken]);

  const login = async (newToken: string) => {
    try {
      // Verify token works by making a test API call
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${newToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      // If token works, save it
      localStorage.setItem('github_token', newToken);
      setToken(newToken);
    } catch (error) {
      throw new Error('Failed to authenticate with GitHub');
    }
  };

  const logout = () => {
    localStorage.removeItem('github_token');
    setToken(null);
  };

  return (
    <GithubAuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        login,
        logout,
      }}
    >
      {children}
    </GithubAuthContext.Provider>
  );
};

export const useGithubAuth = () => {
  const context = useContext(GithubAuthContext);
  if (!context) {
    throw new Error('useGithubAuth must be used within a GithubAuthProvider');
  }
  return context;
};
