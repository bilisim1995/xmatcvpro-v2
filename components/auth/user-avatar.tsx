'use client';

import { User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function UserAvatar() {
  const isLoggedIn = false; // This will be replaced with actual auth state

  if (!isLoggedIn) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-2 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
      >
        <User className="w-4 h-4 text-red-600" />
        <span className="font-medium">Sign In</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
        >
          <Avatar className="h-8 w-8 border-2 border-red-500/20">
            <AvatarFallback className="bg-red-100 dark:bg-red-900/20 text-red-600 font-medium">
              U
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}