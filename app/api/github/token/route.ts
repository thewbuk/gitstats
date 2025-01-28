import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching token for userId:', userId);
    const tokens = await clerkClient.users.getUserOauthAccessToken(
      userId,
      'oauth_github'
    );
    const token = tokens.data[0];

    if (!token) {
      console.log('No token found');
      return NextResponse.json(
        { error: 'GitHub token not found' },
        { status: 401 }
      );
    }

    // Test the token with GitHub API
    const authHeader = `Basic ${Buffer.from(`Bearer ${token.token}`).toString('base64')}`;

    // Check rate limit first
    const rateLimit = await fetch('https://api.github.com/rate_limit', {
      headers: {
        Authorization: authHeader,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'biotech-app',
      },
    });

    if (rateLimit.status === 403) {
      const resetTime = new Date(
        Number(rateLimit.headers.get('x-ratelimit-reset')) * 1000
      );
      return NextResponse.json(
        { error: `Rate limit exceeded. Resets at ${resetTime.toISOString()}` },
        { status: 403 }
      );
    }

    // If rate limit is ok, try the actual request
    const githubResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: authHeader,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'biotech-app',
      },
    });

    const responseText = await githubResponse.text();

    if (!githubResponse.ok) {
      try {
        const errorJson = JSON.parse(responseText);
        return NextResponse.json(
          {
            error: 'Invalid GitHub token',
            details: errorJson.message,
            documentation: errorJson.documentation_url,
          },
          { status: githubResponse.status }
        );
      } catch {
        return NextResponse.json(
          { error: 'Invalid GitHub token', details: responseText },
          { status: githubResponse.status }
        );
      }
    }

    return NextResponse.json({ token: token.token });
  } catch (error) {
    console.error('Failed to get GitHub token:', error);
    return NextResponse.json(
      { error: 'Failed to get GitHub token' },
      { status: 500 }
    );
  }
}
