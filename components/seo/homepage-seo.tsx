'use client';

import Head from 'next/head';

export function HomepageSEO() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "xmatch.pro",
    "description": "AI-powered adult content search engine with advanced face recognition technology",
    "url": "https://xmatch.pro",
    "applicationCategory": "Entertainment",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "xmatch.pro Team",
      "url": "https://xmatch.pro"
    },
    "featureList": [
      "AI Face Recognition",
      "Image Search",
      "Model Database",
      "99% Accuracy",
      "Real-time Processing",
      "Privacy Protection"
    ],
    "screenshot": "https://xmatch.pro/m1.png",
    "softwareVersion": "2.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": ["en", "tr", "de", "ru", "hi", "zh"],
    "isAccessibleForFree": true,
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "memoryRequirements": "256MB RAM",
    "storageRequirements": "10MB",
    "permissions": "Camera access for image uploads"
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>xmatch.pro - AI-Powered Adult Content Search Engine | Face Recognition Technology</title>
      <meta name="title" content="xmatch.pro - AI-Powered Adult Content Search Engine | Face Recognition Technology" />
      <meta name="description" content="Discover adult content with advanced AI face recognition technology. Upload any image and find similar models instantly with 99% accuracy. The most advanced porn star search engine powered by deep neural networks." />
      <meta name="keywords" content="face recognition, AI search, adult content search, porn star finder, image search, neural networks, deep learning, adult entertainment, model search, AI technology, yapay zeka, yüz tanıma, porno yıldızı arama, görsel arama" />
      <meta name="author" content="xmatch.pro Team" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="1 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="RTA-5042-1996-1400-1577-RTA" />
      <meta name="classification" content="Adult Entertainment Technology" />
      <meta name="category" content="Technology" />
      <meta name="coverage" content="Worldwide" />
      <meta name="target" content="adult" />
      <meta name="audience" content="adults" />
      <meta name="content-language" content="en" />
      <meta name="content-type" content="text/html; charset=UTF-8" />
      <meta name="content-script-type" content="text/javascript" />
      <meta name="content-style-type" content="text/css" />
      <meta name="expires" content="never" />
      <meta name="cache-control" content="public, max-age=31536000" />
      <meta name="pragma" content="public" />
      <meta name="imagetoolbar" content="no" />
      <meta name="mssmarttagspreventparsing" content="true" />
      <meta name="IE=edge" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://xmatch.pro/" />
      <meta property="og:title" content="xmatch.pro - AI-Powered Adult Content Search Engine" />
      <meta property="og:description" content="Discover adult content with advanced AI face recognition technology. Upload any image and find similar models instantly with 99% accuracy." />
      <meta property="og:image" content="https://xmatch.pro/m1.png" />
      <meta property="og:image:width" content="128" />
      <meta property="og:image:height" content="128" />
      <meta property="og:image:alt" content="xmatch.pro AI Face Recognition" />
      <meta property="og:site_name" content="xmatch.pro" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="tr_TR" />
      <meta property="og:locale:alternate" content="de_DE" />
      <meta property="og:locale:alternate" content="ru_RU" />
      <meta property="og:locale:alternate" content="hi_IN" />
      <meta property="og:locale:alternate" content="zh_CN" />
      <meta property="og:updated_time" content={new Date().toISOString()} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://xmatch.pro/" />
      <meta property="twitter:title" content="xmatch.pro - AI-Powered Adult Content Search Engine" />
      <meta property="twitter:description" content="Discover adult content with advanced AI face recognition technology. Upload any image and find similar models instantly." />
      <meta property="twitter:image" content="https://xmatch.pro/m1.png" />
      <meta property="twitter:image:alt" content="xmatch.pro AI Face Recognition" />
      <meta property="twitter:creator" content="@xmatchpro" />
      <meta property="twitter:site" content="@xmatchpro" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="xmatch.pro" />
      <meta name="application-name" content="xmatch.pro" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="format-detection" content="date=no" />
      <meta name="format-detection" content="address=no" />
      <meta name="format-detection" content="email=no" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://xmatch.pro/" />
      
      {/* Alternate Languages */}
      <link rel="alternate" hrefLang="en" href="https://xmatch.pro/" />
      <link rel="alternate" hrefLang="tr" href="https://xmatch.pro/tr" />
      <link rel="alternate" hrefLang="de" href="https://xmatch.pro/de" />
      <link rel="alternate" hrefLang="ru" href="https://xmatch.pro/ru" />
      <link rel="alternate" hrefLang="hi" href="https://xmatch.pro/hi" />
      <link rel="alternate" hrefLang="zh" href="https://xmatch.pro/zh" />
      <link rel="alternate" hrefLang="x-default" href="https://xmatch.pro/" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://mc.yandex.ru" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {/* Additional Structured Data for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What file formats are supported?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We support JPG, PNG and WEBP formats."
                }
              },
              {
                "@type": "Question",
                "name": "Is my data secure?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "All uploads are encrypted and automatically deleted after processing."
                }
              },
              {
                "@type": "Question",
                "name": "How accurate are the results?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our AI provides up to 99% accuracy in matching."
                }
              },
              {
                "@type": "Question",
                "name": "How fast are the results?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Results are typically delivered within seconds."
                }
              }
            ]
          })
        }}
      />
    </Head>
  );
}
