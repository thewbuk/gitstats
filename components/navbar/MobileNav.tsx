// components/navbar/MobileNav.tsx

'use client';

import { Youtube, Home, Book, Tv, Plus } from 'lucide-react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from '@/components/common/icons';

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 xl:hidden"
          >
            <span className="sr-only">Toggle Menu</span>
            <Icons.mobile_button />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <MobileLink
            href="/"
            className="flex items-center p-4"
            onOpenChange={setOpen}
          >
            <Youtube className="mr-2 h-6 w-6" />
            <span className="font-bold">Cyclon</span>
          </MobileLink>
          <div className="flex flex-col flex-1 px-6">
            <div className="flex flex-col space-y-3">
              <MobileLink href="/home" onOpenChange={setOpen}>
                <Home className="mr-2 h-4 w-4" />
                Rooms
              </MobileLink>
              <MobileLink href="/categories" onOpenChange={setOpen}>
                <Tv className="mr-2 h-4 w-4" />
                Category
              </MobileLink>
              <div className="flex items-center p-2 cursor-pointer">
                <Book className="mr-2 h-4 w-4" />
                Discover
              </div>
              <MobileLink href="/create" onOpenChange={setOpen}>
                <Plus className="mr-2 h-4 w-4" />
                Create Room
              </MobileLink>
            </div>
          </div>
          <div className="border-t mt-auto">
            <div className="px-6 py-4"></div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn('flex items-center p-2', className)}
      {...props}
    >
      {children}
    </Link>
  );
}
