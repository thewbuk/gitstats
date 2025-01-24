import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const GITHUB_API_URL = 'https://api.github.com';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const sort = searchParams.get('sort') || 'stars';
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Repository-Explorer',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const response = await fetch(
      `${GITHUB_API_URL}/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&order=desc`,
      { 
        headers,
        method: 'GET',
        cache: 'no-store'
      }
    );

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
    console.error('Search failed:', error);
    return NextResponse.json(
      { error: 'Failed to search repositories' },
      { status: 500 }
    );
  }
} 