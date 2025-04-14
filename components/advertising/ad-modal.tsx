'use client';

import { useState } from 'react';
import { Megaphone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AdFeatures } from './sections/ad-features';
import { AdOptions } from './sections/ad-options';
import { ContactSection } from './sections/contact-section';
import { useLanguage } from '@/components/contexts/LanguageContext';

interface AdModalProps {
  trigger?: React.ReactNode;
}

export function AdModal({ trigger }: AdModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            size="lg"
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
          >
            <Megaphone className="w-4 h-4 mr-2" />
            {t('admodal.learn_more')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-red-600" />
            {t('admodal.advertise_with_us')}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(100vh-12rem)]">
          <div className="px-6 py-4 space-y-8">
            {/* Features Section */}
            <AdFeatures />
            
            <Separator />

            {/* Advertising Options */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">{t('admodal.advertising_options')}</h3>
              <AdOptions />
            </section>

            <Separator />

            {/* Contact Section */}
            <ContactSection onClose={() => setIsOpen(false)} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}