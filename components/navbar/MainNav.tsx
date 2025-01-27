'use client';
import { GitGraph } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import * as React from 'react';

type Category = {
  id: number;
  name: string;
  description: string;
};

type MainNavProps = {
  categories: Category[];
};

export function MainNav({ categories }: MainNavProps) {
  return (
    <div className="mr-4 hidden xl:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <GitGraph className="h-6 w-6" />
        <span className="font-bold">GitStats</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {/* <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/home" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Home className="h-4 w-4" />
                  <div className="px-2"> Rooms </div>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Tv className="h-4 w-4" />
                <div className="px-2"> Category </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[400px]">
                  {categories.map((category) => (
                    <ListItem
                      key={category.id}
                      href={`/category/${category.name.toLowerCase().replace(/ /g, '-')}`}
                      title={category.name}
                    >
                      {category.description}
                    </ListItem>
                  ))}
                  <ListItem href="/categories" title="Show More">
                    Explore all available categories
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a
                href="#"
                onClick={handleRandomClick}
                className={navigationMenuTriggerStyle()}
              >
                <Book className="h-4 w-4" />
                <div className="px-2"> Discover </div>
              </a>
            </NavigationMenuItem>
            {/* <NavigationMenuItem>
              <a href="/finance" className={navigationMenuTriggerStyle()}>
                <Coins className="h-4 w-4" />
                <div className="px-2"> Finance </div>
              </a>
            </NavigationMenuItem> 
            <NavigationMenuItem>
              <Link href="/create" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Plus className="h-4 w-4" />
                  <div className="px-2"> Create Room </div>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu> */}
      </nav>
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
