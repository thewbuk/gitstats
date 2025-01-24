const GITHUB_API_URL = 'https://api.github.com';

export async function searchRepositories(query: string, sort: string = 'stars', token: string | null = null) {
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const response = await fetch(
    `/api/github/search?q=${encodeURIComponent(query)}&sort=${sort}`,
    { 
      headers,
      method: 'GET',
      cache: 'no-store'
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to fetch repositories');
  }

  return response.json();
}

export async function getLanguageStats(owner: string, repo: string, token: string | null = null) {
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const response = await fetch(
    `/api/github/languages?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
    { 
      headers,
      method: 'GET',
      cache: 'no-store'
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to fetch language statistics');
  }

  return response.json();
}

export async function getRepository(owner: string, repo: string, token: string | null = null) {
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const response = await fetch(
    `/api/github/repo?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
    { 
      headers,
      method: 'GET',
      cache: 'no-store'
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to fetch repository details');
  }

  return response.json();
} 