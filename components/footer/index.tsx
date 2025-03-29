import { Separator } from '@/components/ui/separator';
import { ActionButtons } from './action-buttons';
import { SocialLinks } from './social-links';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 xmatch.pro |
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="/legal/rta" 
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
              >
                RTA
              </Link>
              <Link 
                href="/legal/disclaimer" 
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
              >
                Disclaimer
              </Link>
              <Link 
                href="/legal/2257" 
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
              >
                2257
              </Link>
              <Link 
                href="/legal/dmca" 
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
              >
                DMCA
              </Link>
              <Link 
                href="/legal/privacy" 
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
              >
                Privacy
              </Link>
              <Link 
                href="/legal/terms" 
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ActionButtons />
            <Separator orientation="vertical" className="h-5" />
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}