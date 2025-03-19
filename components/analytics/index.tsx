'use client';

import { GoogleAnalytics } from './google-analytics';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (
      type: string,
      action: string,
      params?: { [key: string]: string | number | boolean | null | undefined }
    ) => void;
  }
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      window.gtag?.('event', 'page_view', {
        page_path: pathname,
        search_term: searchParams?.get('q') || '',
      });
    }
  }, [pathname, searchParams]);

  return <GoogleAnalytics />;
}