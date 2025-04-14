'use client';

import { ContactButtons } from '../contact/contact-buttons';
import { useLanguage } from '@/components/contexts/LanguageContext';

interface ContactSectionProps {
  onClose: () => void;
}

export function ContactSection({ onClose }: ContactSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold">{t('contactsection.get_in_touch')}</h3>
      <p className="text-muted-foreground">
        {t('contactsection.contact_message')}
      </p>
      <p className="text-xs text-muted-foreground">
        {t('contactsection.response_time')}
      </p>
      <ContactButtons onClose={onClose} />
    </section>
  );
}