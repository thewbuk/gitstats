'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type RepoSearchProps = {
  onSearch: (query: string) => void;
  onSortChange: (sort: string) => void;
  defaultSort: string;
};

export const RepoSearch = ({
  onSearch,
  onSortChange,
  defaultSort,
}: RepoSearchProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
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
        <Select defaultValue={defaultSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stars">Stars</SelectItem>
            <SelectItem value="forks">Forks</SelectItem>
            <SelectItem value="updated">Last Updated</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setQuery('language:javascript');
            onSearch('language:javascript');
          }}
        >
          JavaScript
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setQuery('language:typescript');
            onSearch('language:typescript');
          }}
        >
          TypeScript
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setQuery('language:python');
            onSearch('language:python');
          }}
        >
          Python
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setQuery('language:java');
            onSearch('language:java');
          }}
        >
          Java
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setQuery('');
            onSearch('');
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
