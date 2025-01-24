'use client';

import * as React from 'react';
import { WelcomeSection } from './WelcomeSection';
import { QuickStats } from './QuickStats';
import { ActivityTab } from './ActivityTab';
import { RoomsTab } from './RoomsTab';
import { FriendsTab } from './FriendsTab';
import { UserStats } from './UserStats';
import { CategoryStats } from './CategoryStats';
import { AirportSearch } from './flights/AirportSearch';
import { FareSearch } from './flights/FareSearch';
import { FlightSchedule } from './flights/FlightSchedule';
import { RepoSearch } from './github/RepoSearch';
import { RepoList } from './github/RepoList';
import { RepoStats } from './github/RepoStats';
import { GithubAuth } from './github/GithubAuth';

type DashboardProps = {
  userName?: string | null;
};

export const Dashboard = ({ userName }: DashboardProps) => {
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
            {/* Flight Information Card */}
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">
                Flight Information
              </h2>
              <div className="space-y-6">
                <FlightSchedule />
                <AirportSearch />
                <FareSearch />
              </div>
            </div>

            {/* GitHub Repositories Card */}
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">GitHub Repositories</h2>
                <GithubAuth />
              </div>
              <div className="space-y-6">
                <RepoSearch />
                <RepoList />
                <RepoStats />
              </div>
            </div>

            {/* Activity and Rooms Card */}
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Activity & Rooms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
                  <ActivityTab />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">My Rooms</h3>
                  <RoomsTab />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Friends Card */}
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Friends</h2>
              <FriendsTab />
            </div>

            {/* Stats Cards */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
                <UserStats />
              </div>
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <CategoryStats />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
