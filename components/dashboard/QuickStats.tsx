'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, Video, History } from 'lucide-react';

const stats = [
  { title: 'Watch Time', value: '12h', icon: Video },
  { title: 'Friends', value: '24', icon: Users },
  { title: 'Rooms Created', value: '8', icon: CalendarDays },
  { title: 'Recent Sessions', value: '15', icon: History },
];

export const QuickStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="group hover:border-primary/50 transition-colors"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
