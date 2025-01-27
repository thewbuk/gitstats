import { NextRequest, NextResponse } from 'next/server';

async function fetchAllRepos(token: string) {
  let page = 1;
  let allRepos: any[] = [];
  
  while (true) {
    const response = await fetch(
      `https://api.github.com/user/repos?per_page=100&page=${page}&type=all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );
    
    const repos = await response.json();
    if (repos.length === 0) break;
    
    allRepos = [...allRepos, ...repos];
    page++;
  }
  
  return allRepos;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const [userResponse, repos] = await Promise.all([
      fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }),
      fetchAllRepos(token),
    ]);

    const userData = await userResponse.json();

    return NextResponse.json({
      repoCount: repos.length,
      followerCount: userData.followers,
      contributionCount: repos.filter((repo: any) => !repo.fork).length,
      commitCount: repos.reduce((acc: number, repo: any) => acc + repo.size, 0),
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
} 