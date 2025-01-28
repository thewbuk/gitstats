'use client';

import { useEffect } from 'react';
import { SignUp, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const { handleRedirectCallback } = useClerk();
    const router = useRouter();

    useEffect(() => {
        // Check if this is an SSO callback
        if (window.location.hash.includes('/sso-callback')) {
            const handle = async () => {
                try {
                    const url = new URL(window.location.href);
                    const searchParams = new URLSearchParams(url.search);
                    const afterSignInUrl = searchParams.get('after_sign_in_url') || '/';
                    const afterSignUpUrl = searchParams.get('after_sign_up_url') || '/';

                    await handleRedirectCallback({
                        redirectUrl: url.origin + url.pathname + url.hash,
                        afterSignInUrl,
                        afterSignUpUrl
                    });
                } catch (err) {
                    console.error('Error handling SSO callback:', err);
                    router.push('/');
                }
            };
            handle();
            return;
        }
    }, [handleRedirectCallback, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            {!window.location.hash.includes('/sso-callback') ? (
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