'use client';

import { ContactButtons } from '../contact/contact-buttons';

interface ContactSectionProps {
  onClose: () => void;
}

export function ContactSection({ onClose }: ContactSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold">Get in Touch</h3>
      <p className="text-muted-foreground">
        Interested in advertising with us? Contact our team to discuss opportunities and custom solutions.
      </p>
      
      <ContactButtons onClose={onClose} />
    </section>
  );
}