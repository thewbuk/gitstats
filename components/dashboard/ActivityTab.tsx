'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const recentActivities = [
  'Watched Inception with friends',
  'Created new watch party',
  'Added 3 new friends',
];

export const ActivityTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your latest interactions on the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent"
            >
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>{activity}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
