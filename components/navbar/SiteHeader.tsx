'use client';
import { useState } from 'react';
import { MainNav } from '@/components/navbar/MainNav';
import { MobileNav } from '@/components/navbar/MobileNav';
import { ThemeToggle } from '@/components/theme-toggle';
import { buttonVariants } from '../ui/button';
import { Icons } from '../common/icons';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Category = {
  id: number;
  name: string;
  description: string;
};

export function SiteHeader() {
  const [categories, setCategories] = useState<Category[]>([]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav categories={categories} />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            {/* <CommandSearch /> */}
            <Link href={''} target="_blank" rel="noreferrer">
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'w-9 px-0'
                )}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            {/* <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'w-9 px-0'
                )}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link> */}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
