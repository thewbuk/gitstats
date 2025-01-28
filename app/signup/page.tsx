'use client';

import { useEffect, useState } from 'react';
import { SignUp, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();
  const [isCallback, setIsCallback] = useState(false);

  useEffect(() => {
    setIsCallback(window.location.hash.includes('/sso-callback'));
  }, []);

  useEffect(() => {
    if (isCallback) {
      const handle = async () => {
        try {
          const url = new URL(window.location.href);
          const searchParams = new URLSearchParams(url.search);
          const afterSignInUrl = searchParams.get('after_sign_in_url') || '/';
          const afterSignUpUrl = searchParams.get('after_sign_up_url') || '/';

          await handleRedirectCallback({
            redirectUrl: url.origin + url.pathname + url.hash,
            afterSignInUrl,
            afterSignUpUrl,
          });
        } catch (err) {
          console.error('Error handling SSO callback:', err);
          router.push('/');
        }
      };
      handle();
    }
  }, [isCallback, handleRedirectCallback, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {!isCallback ? (
        <SignUp />
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Completing sign in...</h2>
          <p className="text-muted-foreground">
            Please wait while we redirect you.
          </p>
        </div>
      )}
    </div>
  );
}
