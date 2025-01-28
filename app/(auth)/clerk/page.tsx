'use client';
import { Pattern } from '@/components/ui/pattern';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAuth } from '@clerk/nextjs';
import { SignIn } from '@clerk/nextjs';

export default function ClerkAuthPage() {
  const { userId } = useAuth();

  if (!userId) {
    return (
      <div className="flex justify-center">
        <SignIn />
      </div>
    );
  }

  return (
    <>
      <Pattern variant="checkered" />
      <Dashboard userName={userId} />
    </>
  );
}
