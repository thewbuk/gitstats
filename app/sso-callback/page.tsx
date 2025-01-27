'use client';

import { useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const handle = async () => {
      try {
        await handleRedirectCallback({
          redirectUrl: window.location.origin,
          afterSignInUrl: '/',
        });
      } catch (err) {
        console.error('Error handling SSO callback:', err);
        router.push('/');
      }
    };

    handle();
  }, [handleRedirectCallback, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Completing sign in...</h2>
        <p className="text-muted-foreground">
          Please wait while we redirect you.
        </p>
      </div>
    </div>
  );
}
