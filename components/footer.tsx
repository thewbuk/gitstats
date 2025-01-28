import * as React from 'react';
import Link from 'next/link';
import { DiscordLogoIcon } from '@radix-ui/react-icons';
import { Clapperboard, GitBranchIcon, GitGraph, History } from 'lucide-react';
import { Icons } from './common/icons';

export const Footer = () => {
  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-lg shadow-sm lg:mb-4 lg:border relative ">
      <div className="border-t p-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
          <div className="flex items-center gap-2">
            <GitGraph size={20} />
            <h2 className="text-md font-normal">GitStats</h2>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground"> 2025</p>

            <div className="h-3 border-r" />

            <span className="text-xs text-muted-foreground">
              Data provided by GitHub
            </span>
          </div>

          <div className="flex items-center gap-2 [&_a]:rounded-full [&_a]:border [&_a]:px-3 [&_a]:py-1 [&_a]:shadow">
            <Link
              href={'https://github.com/thewbuk/gitstats'}
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center gap-1">
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
