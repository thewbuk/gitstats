'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { searchRepositories } from '@/lib/github';

type RepoSearchProps = {
    onSearch: (repos: any[]) => void;
};

export const RepoSearch = ({ onSearch }: RepoSearchProps) => {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('stars');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('github_token');
            const result = await searchRepositories(query, sort, token);
            onSearch(result.items);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Input
                    placeholder="Search repositories..."
                    className="flex-1"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="stars">Stars</SelectItem>
                        <SelectItem value="forks">Forks</SelectItem>
                        <SelectItem value="updated">Last Updated</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search'}
                </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => setQuery('language:javascript')}>JavaScript</Button>
                <Button variant="outline" size="sm" onClick={() => setQuery('language:typescript')}>TypeScript</Button>
                <Button variant="outline" size="sm" onClick={() => setQuery('language:python')}>Python</Button>
                <Button variant="outline" size="sm" onClick={() => setQuery('language:java')}>Java</Button>
                <Button variant="outline" size="sm" onClick={() => setQuery('')}>Clear</Button>
            </div>
        </div>
    );
}; 