'use client';
import { GitGraph } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import * as React from 'react';

export function MainNav() {
  return (
    <div className="mr-4 hidden xl:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <GitGraph className="h-6 w-6" />
        <span className="font-bold">GitStats</span>
      </Link>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  const isShowMore = title === 'Show More';
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
            isShowMore
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 font-semibold'
              : 'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'text-sm font-medium leading-none',
              isShowMore && 'text-primary-foreground'
            )}
          >
            {title}
          </div>
          <p
            className={cn(
              'line-clamp-2 text-sm leading-snug',
              isShowMore
                ? 'text-primary-foreground/90'
                : 'text-muted-foreground'
            )}
          >
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = 'ListItem';
