'use client';

import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactButtonsProps {
  onClose?: () => void;
}

export function ContactButtons({ onClose }: ContactButtonsProps) {
  const handleEmailClick = () => {
    window.open('mailto:info@xmatch.pro');
    onClose?.();
  };

  const handleTelegramClick = () => {
    window.open('https://t.me/xmatchpro', '_blank');
    onClose?.();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        onClick={handleEmailClick}
        className="flex-1 gap-2"
        variant="outline"
      >
        <Mail className="w-4 h-4" />
        info@xmatch.pro
      </Button>
      
      <Button
        onClick={handleTelegramClick}
        className="flex-1 gap-2"
        variant="outline"
      >
        <MessageCircle className="w-4 h-4" />
        @xmatchpro
      </Button>
    </div>
  );
}