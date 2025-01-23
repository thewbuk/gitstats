import { Repository } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export function RepositoryCard({ repo }: { repo: Repository }) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{repo.name}</span>
                    <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4" />
                        {repo.stargazers_count}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {repo.description}
                </p>
                <div className="mt-4 flex items-center gap-2">
                    {repo.language && (
                        <span className="text-xs bg-secondary px-2 py-1 rounded">
                            {repo.language}
                        </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                        Updated {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
} 