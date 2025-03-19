'use client';

import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SearchButtonProps {
  onClick: () => void;
  isLoading: boolean;
  loadingProgress?: number;
  disabled?: boolean;
}

export function SearchButton({ onClick, isLoading, loadingProgress = 0, disabled }: SearchButtonProps) {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled || isLoading || loadingProgress < 100}
      className={cn(
        "w-[300px] mx-auto px-8 py-6 text-lg font-medium rounded-2xl",
        "shadow-lg hover:shadow-xl transition-all duration-300",
        "flex items-center justify-center gap-3",
        "hover:scale-[1.02] active:scale-[0.98]",
        disabled || loadingProgress < 100
          ? "bg-muted text-muted-foreground cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700 text-white"
      )}
    >
      {isLoading || loadingProgress < 100 ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading Models...</span>
        </>
      ) : (
        <>
          <Search className="w-5 h-5" />
          <span>Search</span>
        </>
      )}
    </Button>
  );
}