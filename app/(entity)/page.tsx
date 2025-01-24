'use client';
import { Pattern } from '@/components/ui/pattern';
import { Dashboard } from '@/components/dashboard/Dashboard';

export default function Home() {
  return (
    <>
      <Pattern variant="checkered" />
      <Dashboard userName={'User'} />
    </>
  );
}
