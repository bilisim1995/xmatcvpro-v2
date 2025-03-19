import { Mail, MessageCircle, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SocialLinks() {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="hover:text-red-600 transition-colors"
      >
        <a
          href="mailto:info@xmatch.pro"
          aria-label="Email us"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Mail className="h-5 w-5" />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="hover:text-red-600 transition-colors"
      >
        <a
          href="https://t.me/xmatchpro"
          aria-label="Contact us on Telegram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="hover:text-red-600 transition-colors"
      >
        <a
          href="https://instagram.com/xmatchpro"
          aria-label="Follow us on Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram className="h-5 w-5" />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="hover:text-red-600 transition-colors"
      >
        <a
          href="https://twitter.com/xmatchpro"
          aria-label="Follow us on X (Twitter)"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="h-5 w-5" />
        </a>
      </Button>
    </>
  );
}