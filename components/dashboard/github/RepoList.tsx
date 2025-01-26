'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, Eye } from 'lucide-react';
import { RepoSearch } from './RepoSearch';
import { Skeleton } from '@/components/ui/skeleton';
import { Repository } from '../Dashboard';

type RepoListProps = {
  onRepositoriesChange?: (repos: Repository[]) => void;
};

export const RepoList = ({ onRepositoriesChange }: RepoListProps) => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sort, setSort] = useState('stars');

  const fetchRepos = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${query || 'stars:>10000'}&sort=${sort}&order=desc`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const data = await response.json();
      setRepos(data.items);
      onRepositoriesChange?.(data.items);
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    fetchRepos(query);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    fetchRepos('');
  };

  // Initial fetch
  useState(() => {
    fetchRepos('');
  });

  return (
    <div className="space-y-6">
      <RepoSearch
        onSearch={handleSearch}
        defaultSort={sort}
        onSortChange={handleSortChange}
      />
      <div className="space-y-4">
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-xl" />
            ))
        ) : repos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No repositories found. Try searching above.
          </div>
        ) : (
          repos.map((repo) => (
            <Card key={repo.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold hover:underline"
                  >
                    {repo.owner.login}/{repo.name}
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    {repo.description}
                  </p>
                </div>
                <img
                  src={repo.owner.avatar_url}
                  alt={`${repo.owner.login}'s avatar`}
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div className="flex items-center gap-4 mt-4">
                {repo.language && (
                  <Badge variant="outline">{repo.language}</Badge>
                )}
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4" />
                  {repo.stargazers_count.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <GitFork className="w-4 h-4" />
                  {repo.forks_count.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Eye className="w-4 h-4" />
                  {repo.watchers_count.toLocaleString()}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
