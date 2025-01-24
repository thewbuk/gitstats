'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus } from 'lucide-react';

const rooms = ['Movie Night', 'Anime Club', 'Series Marathon'];

export const RoomsTab = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">My Watch Rooms</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Create Room
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <Card
            key={room}
            className="group hover:border-primary/50 transition-colors"
          >
            <CardHeader>
              <CardTitle className="text-lg">{room}</CardTitle>
              <CardDescription>Active now • 5 participants</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">
                Join Room
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
