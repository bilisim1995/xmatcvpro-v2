"use client";

import { SearchHeader } from '@/components/search-by-face/search-header';
import { SearchTabs } from '@/components/search-by-face/tabs/index';
import dynamic from 'next/dynamic';
const HowItWorks = dynamic(() => import('@/components/search-by-face/how-it-works').then(m => m.HowItWorks), { ssr: false, loading: () => <div className="h-40 animate-pulse bg-muted rounded-lg" /> });
const PremiumBanner = dynamic(() => import('@/components/advertising/premium-banner').then(m => m.PremiumBanner), { ssr: false, loading: () => <div className="h-32 animate-pulse bg-muted rounded-lg" /> });
const BlogSection = dynamic(() => import('@/components/search-by-face/blog').then(m => m.BlogSection), { ssr: false, loading: () => <div className="h-60 animate-pulse bg-muted rounded-lg" /> });
const DevelopmentStatus = dynamic(() => import('@/components/search-by-face/development-status').then(m => m.DevelopmentStatus), { ssr: false, loading: () => <div className="h-20 animate-pulse bg-muted rounded-lg" /> });
const ComplianceBadges = dynamic(() => import('@/components/search-by-face/compliance-badges').then(m => m.ComplianceBadges), { ssr: false, loading: () => <div className="h-32 animate-pulse bg-muted rounded-lg" /> });
import { Card } from '@/components/ui/card';
import { CoffeeButton } from '@/components/coffee-button';
import { SensualVibesPrompt } from '@/components/sensual-vibes-prompt';

export default function SearchPage() {
  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "xmatch.pro",
    "description": "Find pornstars and adult models using AI-powered face recognition technology. Upload any face photo and discover matching performers instantly with 99% accuracy.",
    "url": "https://xmatch.pro",
    "applicationCategory": "EntertainmentApplication",
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

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "xmatch.pro",
    "url": "https://xmatch.pro",
    "logo": "https://xmatch.pro/m1.png",
    "description": "Find pornstars and adult models using AI-powered face recognition technology. Upload any face photo and discover matching performers instantly with 99% accuracy.",
    "sameAs": [
      "https://twitter.com/xmatchpro"
    ]
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://xmatch.pro"
      }
    ]
  };

  const faqData = {
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
  };

  const howToData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Search for Pornstars by Face with AI",
    "description": "Step-by-step guide to using xmatch.pro AI face recognition search engine",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Upload Image",
        "text": "Upload or drag and drop a face image in JPG, PNG, or WEBP format",
        "image": "https://xmatch.pro/woman2.gif"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "AI Processing",
        "text": "Our AI analyzes facial features using advanced neural networks",
        "image": "https://xmatch.pro/m1.png"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "View Results",
        "text": "Get instant results with matching models and similarity scores up to 99% accuracy",
        "image": "https://xmatch.pro/m1.png"
      }
    ],
    "totalTime": "PT30S",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    }
  };

  const searchActionData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "xmatch.pro",
    "url": "https://xmatch.pro",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://xmatch.pro/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const itemListData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "xmatch.pro Features",
    "description": "Key features of the AI-powered face recognition search engine",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "AI Face Recognition",
        "description": "Advanced neural network-based facial recognition technology"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "99% Accuracy",
        "description": "High precision matching with up to 99% accuracy rate"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "10,000+ Model Database",
        "description": "Extensive database of adult performers"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Real-time Processing",
        "description": "Instant results within seconds"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Privacy Protection",
        "description": "Encrypted uploads with automatic deletion"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "Multi-language Support",
        "description": "Available in 6 languages: English, Turkish, German, Russian, Hindi, Chinese"
      }
    ]
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(searchActionData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListData)
        }}
      />
      
      <main id="main-content" className="min-h-screen w-full overflow-x-hidden" role="main" aria-label="Main content">
      <div className="w-full max-w-full px-2 sm:container sm:mx-auto sm:px-6 pt-16 sm:pt-24 pb-8 sm:pb-16">
        <SearchHeader />

        <div className="w-full sm:max-w-4xl mx-auto overflow-hidden">
          <Card className="w-full p-3 sm:p-6 shadow-xl mb-6 sm:mb-8" role="region" aria-label="Search interface">
            <SearchTabs />
          </Card>

          <section className="mb-6 sm:mb-8" aria-label="Support section">
            <CoffeeButton />
          </section>
     
          <section className="mb-6 sm:mb-8" aria-label="How it works">
            <HowItWorks />
          </section>
     
          <section className="mb-6 sm:mb-8" aria-label="Premium features">
            <PremiumBanner />
          </section>
     
          <section className="mb-6 sm:mb-8" aria-label="Blog articles">
            <BlogSection />
          </section>
     
          <section aria-label="Development status">
            <DevelopmentStatus />
            <ComplianceBadges />
          </section>
        </div>
      </div>
      <SensualVibesPrompt />
      </main>
    </>
  );
}