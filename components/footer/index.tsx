import { Separator } from '@/components/ui/separator';
import { ActionButtons } from './action-buttons';
import { SocialLinks } from './social-links';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 xmatch.pro. All rights reserved.
          </p>
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