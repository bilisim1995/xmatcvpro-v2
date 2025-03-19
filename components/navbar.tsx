'use client';

import { ThemeToggle } from './theme-toggle';
import { Logo } from './logo';
import { NavMenu } from './nav-menu';
import { MobileNav } from './mobile-nav';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex h-16 items-center">
        <Logo />
        <NavMenu />
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}