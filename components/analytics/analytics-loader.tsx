'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics } from './google-analytics';
import { GoogleTagManager } from './google-tag-manager';
import { YandexMetrika } from './yandex-metrika';

export function AnalyticsLoader() {
  const [consented, setConsented] = useState(false);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('gdpr-consent');
      setConsented(consent === 'accepted');
    } catch {}
  }, []);

  useEffect(() => {
    if (!consented) return;
    const idleCallback = (cb: () => void) => {
      if ('requestIdleCallback' in window) {
        return (window as any).requestIdleCallback(cb);
      }
      return setTimeout(cb, 1500);
    };
    const id = idleCallback(() => setIdle(true));
    return () => {
      if ('cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback?.(id);
      } else {
        clearTimeout?.(id);
      }
    };
  }, [consented]);

  // Listen for consent changes (same-tab updates)
  useEffect(() => {
    if (consented) return; // No need to check if already consented

    const checkConsent = () => {
      try {
        const consent = localStorage.getItem('gdpr-consent');
        if (consent === 'accepted') {
          setConsented(true);
        }
      } catch {}
    };

    // Check periodically until consent is given
    const interval = setInterval(checkConsent, 500);

    // Also listen for storage events (cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gdpr-consent' && e.newValue === 'accepted') {
        setConsented(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [consented]);

  if (!consented || !idle) return null;

  return (
    <>
      <YandexMetrika />
      <GoogleAnalytics />
      <GoogleTagManager />
    </>
  );
}


