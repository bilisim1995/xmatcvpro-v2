'use client';

import { useState } from 'react';
import { AlertTriangle, ExternalLink, Shield, Video, Play, Film, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/contexts/LanguageContext';

interface VideoModalProps {
  modelName: string;
  videoUrl: string;
  trigger?: React.ReactNode;
}

export function VideoModal({ modelName, videoUrl, trigger }: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  
  const platforms = [
    {
      name: 'XVideos',
      icon: Play,
      url: videoUrl || `https://www.xvideos.com/?k=${encodeURIComponent(modelName)}`,
      color: 'bg-red-600 hover:bg-red-700',
      description: t('videomodal.platforms.xvideos')
    },
    {
      name: 'PornHub',
      icon: Film,
      url: `https://www.pornhub.com/video/search?search=${encodeURIComponent(modelName)}`,
      color: 'bg-amber-500 hover:bg-amber-600',
      description: t('videomodal.platforms.pornhub')
    },
    {
      name: 'OnlyFans',
      icon: Star,
      url: `https://onlyfans.com/search?q=${encodeURIComponent(modelName)}`,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: t('videomodal.platforms.onlyfans')
    }
  ];

  const handlePlatformClick = (url: string) => {
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="default"
            size="sm"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {t('videomodal.videos')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <DialogTitle className="text-center">{t('videomodal.adult_content_warning')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning Message */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              {t('videomodal.warning_message').replace('{modelName}', modelName)}
            </p>
          </div>

          {/* Platform Buttons */}
          <div className="space-y-3">
            {platforms.map((platform) => (
              <Button
                key={platform.name}
                onClick={() => handlePlatformClick(platform.url)}
                className={`w-full text-white ${platform.color} flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <platform.icon className="w-5 h-5" />
                  <span>{platform.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-75">{platform.description}</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </Button>
            ))}
          </div>

          {/* Cancel Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsOpen(false)}
          >
            {t('videomodal.cancel')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}