'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, Eye } from 'lucide-react';
import { RepoSearch } from './RepoSearch';
import { getLanguageStats } from '@/lib/github';

type Repository = {
    id: number;
    name: string;
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    html_url: string;
    owner: {
        login: string;
        avatar_url: string;
    };
    languages?: { [key: string]: number };
};

type RepoListProps = {
    onRepositoriesChange?: (repos: Repository[]) => void;
};

export const RepoList = ({ onRepositoriesChange }: RepoListProps) => {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);

    useEffect(() => {
        onRepositoriesChange?.(repos);
    }, [repos, onRepositoriesChange]);

    const handleSearch = async (searchResults: Repository[]) => {
        setRepos(searchResults);
        setIsLoadingLanguages(true);

        try {
            const token = localStorage.getItem('github_token');
            const reposWithLanguages = await Promise.all(
                searchResults.map(async (repo) => {
                    try {
                        const languages = await getLanguageStats(repo.owner.login, repo.name, token);
                        return { ...repo, languages };
                    } catch (error) {
                        console.error(`Failed to fetch languages for ${repo.name}:`, error);
                        return repo;
                    }
                })
            );
            setRepos(reposWithLanguages);
        } catch (error) {
            console.error('Failed to fetch languages:', error);
        } finally {
            setIsLoadingLanguages(false);
        }
    };

    return (
        <div className="space-y-6">
            <RepoSearch onSearch={handleSearch} />
            <div className="space-y-4">
                {repos.length === 0 ? (
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
                            {repo.languages && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {Object.entries(repo.languages).map(([lang, bytes]) => (
                                        <Badge key={lang} variant="secondary">
                                            {lang}: {((bytes / Object.values(repo.languages!).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}; 