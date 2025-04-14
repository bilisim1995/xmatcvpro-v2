import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/components/contexts/LanguageContext';

interface AgeVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: () => void;
}

export function AgeVerificationDialog({ open, onOpenChange, onVerify }: AgeVerificationDialogProps) {
  const { t } = useLanguage();

  const handleVerify = () => {
    localStorage.setItem('age-verified', 'true');
    onVerify();
  };

  const handleDecline = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <DialogTitle className="text-center">{t('ageverification.title')}</DialogTitle>
          <DialogDescription className="text-center">
            {t('ageverification.subtitle')}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              {t('ageverification.confirm_message')}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleVerify}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
            >
              {t('ageverification.confirm_button')}
            </Button>
            <Button
              variant="outline"
              onClick={handleDecline}
              className="w-full"
            >
              {t('ageverification.exit_button')}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            {t('ageverification.disclaimer')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}