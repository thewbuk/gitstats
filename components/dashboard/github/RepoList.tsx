'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, Eye } from 'lucide-react';
import { RepoSearch } from './RepoSearch';
import { Skeleton } from '@/components/ui/skeleton';
import { Repository } from '../Dashboard';
import { ScrollArea } from '@/components/ui/scroll-area';

type RepoListProps = {
    onRepositoriesChange?: (repos: Repository[]) => void;
};

export const RepoList = ({ onRepositoriesChange }: RepoListProps) => {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sort, setSort] = useState('stars');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [query, setQuery] = useState('');
    const observer = useRef<IntersectionObserver>();
    const lastRepoElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    const fetchRepos = async (searchQuery: string, pageNum: number, isNewSearch: boolean = false) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://api.github.com/search/repositories?q=${searchQuery || 'stars:>1000'}&sort=${sort}&order=desc&page=${pageNum}&per_page=20`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }
            const data = await response.json();

            if (isNewSearch) {
                setRepos(data.items);
            } else {
                setRepos(prev => [...prev, ...data.items]);
            }

            setHasMore(data.items.length === 20);
            onRepositoriesChange?.(data.items);
        } catch (error) {
            console.error('Failed to fetch repositories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (newQuery: string) => {
        setQuery(newQuery);
        setPage(1);
        setHasMore(true);
        fetchRepos(newQuery, 1, true);
    };

    const handleSortChange = (newSort: string) => {
        setSort(newSort);
        setPage(1);
        setHasMore(true);
        fetchRepos(query, 1, true);
    };

    useEffect(() => {
        if (page > 1) {
            fetchRepos(query, page);
        }
    }, [page]);

    // Initial fetch
    useEffect(() => {
        fetchRepos('', 1, true);
    }, []);

    return (
        <div className="space-y-6">
            <RepoSearch
                onSearch={handleSearch}
                defaultSort={sort}
                onSortChange={handleSortChange}
            />
            <ScrollArea className="h-[600px] rounded-md border p-4">
                <div className="space-y-4">
                    {repos.map((repo, index) => (
                        <div
                            key={repo.id}
                            ref={index === repos.length - 1 ? lastRepoElementRef : undefined}
                        >
                            <Card className="p-4">
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
                        </div>
                    ))}
                    {isLoading && (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-[140px] rounded-xl" />
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};
