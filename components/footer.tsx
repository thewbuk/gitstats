import * as React from 'react';
import Link from 'next/link';
import { DiscordLogoIcon } from '@radix-ui/react-icons';
import { Clapperboard, History } from 'lucide-react';

export const Footer = () => {
  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-lg shadow-sm lg:mb-4 lg:border relative ">
      <div className="border-t p-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
          <div className="flex items-center gap-2">
            <Clapperboard size={20} />
            <h2 className="text-md font-normal">Cyclon</h2>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground"> 2024</p>

            <div className="h-3 border-r" />

            <span className="text-xs text-muted-foreground">
              Data provided by YouTube
            </span>
          </div>

          <div className="flex items-center gap-2 [&_a]:rounded-full [&_a]:border [&_a]:px-3 [&_a]:py-1 [&_a]:shadow">
            <Link href="/changelog" className="flex items-center gap-1">
              <History size={16} />
            </Link>

            <Link
              href="https://discord.gg/6Hjumj65"
              className="flex items-center gap-1"
            >
              <DiscordLogoIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
