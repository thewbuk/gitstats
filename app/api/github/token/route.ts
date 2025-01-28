import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const authRequest = await auth();
    if (!authRequest?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = await authRequest.getToken({
      template: 'oauth_github',
    });

    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not found' },
        { status: 401 }
      );
    }

    // Test the token with GitHub API
    const githubResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'biotech-app',
      },
    });

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      console.error('GitHub API test failed:', errorText);
      return NextResponse.json(
        { error: 'Invalid GitHub token' },
        { status: githubResponse.status }
      );
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Failed to get GitHub token:', error);
    return NextResponse.json(
      { error: 'Failed to get GitHub token' },
      { status: 500 }
    );
  }
}
