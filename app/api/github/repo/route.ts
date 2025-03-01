import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API_URL = 'https://api.github.com';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Owner and repo parameters are required' },
        { status: 400 }
      );
    }

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Repository-Explorer',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}`, {
      headers,
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('GitHub API error:', errorData);
      return NextResponse.json(
        { error: 'GitHub API request failed', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch repository:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repository details' },
      { status: 500 }
    );
  }
}
