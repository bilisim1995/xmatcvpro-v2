'use client';

import Script from 'next/script';

export function GoogleAnalytics() {
  return (
    <>
      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=G-HTHLVEFBEE" 
        strategy="afterInteractive"
      />
      <Script 
        id="google-analytics" 
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-HTHLVEFBEE', {
            page_path: window.location.pathname,
            adult_content: true,
            age_verified: localStorage.getItem('age-verified') === 'true'
          });
        `}
      </Script>
    </>
  );
}