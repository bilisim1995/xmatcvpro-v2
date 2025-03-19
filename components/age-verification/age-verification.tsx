'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function AgeVerification() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isVerified = localStorage.getItem('age-verified');
    if (!isVerified && pathname !== '/') {
      setOpen(true);
    }
  }, [pathname]);

  const handleVerify = () => {
    localStorage.setItem('age-verified', 'true');
    setOpen(false);
  };

  const handleDecline = () => {
    window.location.href = '/';
  };

  if (pathname === '/') return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl">Age Verification Required</DialogTitle>
          <DialogDescription className="text-center">
            This content is intended for mature audiences.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              By clicking &quot;I am over 18&quot;, you confirm that you are of legal age to view adult content in your location.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleVerify}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
            >
              I am over 18
            </Button>
            <Button
              variant="outline"
              onClick={handleDecline}
              className="w-full"
            >
              Exit
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            This verification is required by law. We do not collect or store any personal information.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}