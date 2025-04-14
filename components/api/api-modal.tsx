'use client';

import { Code2, Cpu, Database, Server } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/components/contexts/LanguageContext';

export function ApiModal() {
  const { t } = useLanguage();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-red-600 transition-colors">
          <Code2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-red-600" />
            {t('apimodal.title')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-8">
            {/* Coming Soon Banner */}
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-red-600 to-red-500 p-8 text-white">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">{t('apimodal.coming_soon')}</h2>
                <p className="text-white/90">
                  {t('apimodal.coming_description')}
                </p>
              </div>
              <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3">
                <Cpu className="w-32 h-32 text-white/10" />
              </div>
            </div>

            {/* Features */}
            <div className="grid gap-6">
              <Card className="p-6 space-y-4">
                <div className="p-3 w-fit rounded-lg bg-red-100 dark:bg-red-900/20">
                  <Server className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold">{t('apimodal.restful_api_title')}</h3>
                <p className="text-muted-foreground">
                  {t('apimodal.restful_api_description')}
                </p>
              </Card>

              <Card className="p-6 space-y-4">
                <div className="p-3 w-fit rounded-lg bg-red-100 dark:bg-red-900/20">
                  <Database className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold">{t('apimodal.extensive_db_title')}</h3>
                <p className="text-muted-foreground">
                  {t('apimodal.extensive_db_description')}
                </p>
              </Card>
            </div>
            
            {/* Available Data */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">{t('apimodal.available_data_title')}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('apimodal.physical_attributes')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Age, height, weight, and measurements</li>
                    <li>• Hair color, eye color, and cup size</li>
                    <li>• Ethnicity and nationality</li>
                    <li>• Tattoos and piercings</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">{t('apimodal.face_analysis')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 128-dimensional face descriptors</li>
                    <li>• Facial landmark positions</li>
                    <li>• Face detection confidence scores</li>
                    <li>• Face similarity matching</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Get Early Access */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">{t('apimodal.get_early_access_title')}</h3>
              <p className="text-muted-foreground">
                {t('apimodal.get_early_access_description')}
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
                onClick={() => window.open('https://t.me/xmatchpro', '_blank')}
              >
                {t('apimodal.contact_button')}
              </Button>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}