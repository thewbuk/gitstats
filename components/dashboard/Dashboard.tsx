'use client';

import * as React from 'react';
import { WelcomeSection } from './WelcomeSection';
import { QuickStats } from './QuickStats';
import { RepoList } from './github/RepoList';
import { RepoStats } from './github/RepoStats';
import { FollowersTab } from './github/FollowersTab';
import { LanguageStats } from './github/LanguageStats';
import { CommitActivityStats } from './github/CommitActivityStats';
import { CommitActivityChart } from './github/CommitActivityChart';
import { RepoActivityChart } from './github/RepoActivityChart';

export type Repository = {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  languages?: { [key: string]: number };
};

type DashboardProps = {
  userName?: string | null;
};

export const Dashboard = ({ userName }: DashboardProps) => {
  const [repositories, setRepositories] = React.useState<Repository[]>([]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-primary/5 via-primary/2 to-transparent">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <WelcomeSection userName={userName} />
        </div>

        {/* Quick Stats Section */}
        <div className="mb-8">
          <QuickStats />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* GitHub Repositories Card */}
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">GitHub Repositories</h2>
              </div>
              <RepoList onRepositoriesChange={setRepositories} />
            </div>

            {/* Activity Charts */}
            <div className="grid grid-cols-1 gap-6">
              <CommitActivityChart />
              <RepoActivityChart />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* GitHub Stats Card */}
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <RepoStats repositories={repositories} />
            </div>

            {/* Friends Card */}
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Friends</h2>
              <FollowersTab />
            </div>

            {/* Stats Cards */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
                <CommitActivityStats />
              </div>
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <LanguageStats />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
