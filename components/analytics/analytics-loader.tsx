'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics } from './google-analytics';
import { GoogleTagManager } from './google-tag-manager';
import { MicrosoftClarity } from './microsoft-clarity';
import { YandexMetrika } from './yandex-metrika';
import { Analytics } from './index';

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

  if (!consented || !idle) return null;

  return (
    <>
      <YandexMetrika />
      <GoogleAnalytics />
      <GoogleTagManager />
      <MicrosoftClarity />
      <Analytics />
    </>
  );
}


