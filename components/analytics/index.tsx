'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    gtag: (
      type: string,
      action: string,
      params?: { [key: string]: string | number | boolean | null | undefined }
    ) => void;
    ym?: (id: number, action: string, params?: any) => void;
  }
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('gdpr-consent');
      setConsented(consent === 'accepted');
    } catch {}
  }, []);

  useEffect(() => {
    if (!consented || !pathname) return;

    // Google Analytics page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        search_term: searchParams?.get('q') || '',
      });
    }

    // Yandex Metrika page view
    if (window.ym) {
      window.ym(101052432, 'hit', pathname);
    }
  }, [pathname, searchParams, consented]);

  // This component only handles page view tracking, doesn't render scripts
  return null;
}