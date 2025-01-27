'use client';

import { useEffect } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SSOCallback() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    async function handleCallback() {
      try {
        const handledResponse = await signIn.handleRedirectCallback();
        if (handledResponse) {
          router.push('/');
        }
      } catch (err) {
        console.error('Error during OAuth callback:', err);
        router.push('/');
      }
    }

    handleCallback();
  }, [isLoaded, signIn, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Completing sign in...</h1>
        <p className="text-muted-foreground">
          Please wait while we complete your sign in.
        </p>
      </div>
    </div>
  );
}
