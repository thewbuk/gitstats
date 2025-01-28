import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/(.*)',
  '/signin(.*)',
  '/signup(.*)',
  '/verify-email(.*)',
  '/forgot-password(.*)',
  '/confirm-password(.*)',
  '/unrecoverable-error(.*)',
  '/pro(.*)',
  '/changelog(.*)',
  '/privacy(.*)',
  '/api/send(.*)',
  '/sso-callback(.*)',
  '/sign-up/(.*)'
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  },
  { debug: false, signInUrl: '/' }
);

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
