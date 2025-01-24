'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const friends = ['Alice', 'Bob', 'Charlie'];

export const FriendsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Friends List</CardTitle>
        <CardDescription>People you watch with</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {friends.map((friend, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10"></div>
                <span>{friend}</span>
              </div>
              <Button variant="ghost" size="sm">
                Watch Together
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
