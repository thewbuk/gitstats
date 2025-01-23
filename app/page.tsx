"use client";

import { RepositoryCard } from "@/app/components/repository-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Repository } from "@/types/github";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
    const [search, setSearch] = useState("");

    const { data: repos, isLoading } = useQuery<Repository[]>({
        queryKey: ["repos", search],
        queryFn: async () => {
            const response = await fetch(
                `https://api.github.com/search/repositories?q=${search || "stars:>10000"}&sort=stars&order=desc`
            );
            const data = await response.json();
            return data.items as Repository[];
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <Input
                    placeholder="Search repositories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button>Search</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[200px] rounded-xl" />
                    ))
                ) : (
                    repos?.map((repo: Repository) => (
                        <RepositoryCard key={repo.id} repo={repo} />
                    ))
                )}
            </div>
        </div>
    );
} 