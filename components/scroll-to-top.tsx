'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "fixed right-6 bottom-6 z-50 rounded-full shadow-lg hover:shadow-xl",
        "bg-background/80 backdrop-blur hover:bg-red-100 dark:hover:bg-red-900/20",
        "hover:text-red-600 transition-all duration-300",
        "opacity-0 translate-y-4",
        show && "opacity-100 translate-y-0"
      )}
      onClick={scrollToTop}
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  );
}