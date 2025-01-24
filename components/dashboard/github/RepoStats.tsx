'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type Repository = {
    id: number;
    language: string;
    stargazers_count: number;
    languages?: { [key: string]: number };
};

type RepoStatsProps = {
    repositories: Repository[];
};

export const RepoStats = ({ repositories }: RepoStatsProps) => {
    const calculateLanguageStats = () => {
        const stats: { [key: string]: number } = {};
        let totalRepos = 0;

        repositories.forEach((repo) => {
            if (repo.languages) {
                Object.entries(repo.languages).forEach(([lang, bytes]) => {
                    stats[lang] = (stats[lang] || 0) + bytes;
                });
            } else if (repo.language) {
                stats[repo.language] = (stats[repo.language] || 0) + 1;
                totalRepos++;
            }
        });

        // Convert bytes to percentages
        const total = Object.values(stats).reduce((a, b) => a + b, 0);
        const percentages = Object.fromEntries(
            Object.entries(stats)
                .map(([lang, value]) => [lang, (value / total) * 100])
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5) // Top 5 languages
        );

        return percentages;
    };

    const colors: { [key: string]: string } = {
        JavaScript: 'bg-yellow-400',
        TypeScript: 'bg-blue-500',
        Python: 'bg-green-500',
        Java: 'bg-red-500',
        Go: 'bg-cyan-500',
        Rust: 'bg-orange-500',
        Ruby: 'bg-pink-500',
        PHP: 'bg-purple-500',
        'C++': 'bg-indigo-500',
        CSS: 'bg-teal-500',
        HTML: 'bg-amber-500',
    };

    const languageStats = calculateLanguageStats();
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    return (
        <Card className="p-4">
            <h3 className="font-semibold mb-4">Repository Statistics</h3>
            <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-2">Total Repositories: {repositories.length}</div>
                <div className="text-sm text-muted-foreground">Total Stars: {totalStars.toLocaleString()}</div>
            </div>
            <h4 className="font-medium mb-4">Language Distribution</h4>
            <div className="space-y-4">
                {Object.entries(languageStats).map(([language, percentage]) => (
                    <div key={language}>
                        <div className="flex justify-between text-sm mb-1">
                            <span>{language}</span>
                            <span>{percentage.toFixed(1)}%</span>
                        </div>
                        <Progress
                            value={percentage}
                            className={`h-2 ${colors[language] || 'bg-gray-500'}`}
                        />
                    </div>
                ))}
            </div>
        </Card>
    );
}; 