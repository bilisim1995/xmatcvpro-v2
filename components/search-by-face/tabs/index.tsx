'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Scan } from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useLanguage } from '@/components/contexts/LanguageContext';

const ImageSearchTab = dynamic(
  () => import('./image-search-tab'),
  { 
    loading: () => <div className="h-96 animate-pulse bg-muted rounded-lg" />,
    ssr: false 
  }
);

const AdvancedSearchTab = dynamic(
  () => import('./advanced-search-tab'),
  { 
    loading: () => <div className="h-96 animate-pulse bg-muted rounded-lg" />,
    ssr: false 
  }
);

const tabVariants = {
  inactive: {
    opacity: 0.6,
    scale: 0.95
  },
  active: {
    opacity: 1,
    scale: 1
  }
};

export function SearchTabs() {
  const [activeTab, setActiveTab] = useState('image');
  const { t } = useLanguage();

  const TabContent = ({ icon: Icon, text }: { icon: typeof Search; text: string }) => {
    return (
      <motion.div
        className="flex items-center justify-center gap-1 sm:gap-3 w-full"
        variants={tabVariants}
        initial="inactive"
        animate="active"
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        <span>{text}</span>
      </motion.div>
    );
  };

  return (
    <Tabs 
      defaultValue="image" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full space-y-4 sm:space-y-8"
      aria-label="Search options"
    >
      <TabsList className="grid w-full grid-cols-2 h-10 sm:h-14 p-1 sm:p-1.5 bg-muted/50 rounded-lg" role="tablist" aria-label="Search method selection">
        <TabsTrigger 
          value="image" 
          className="relative h-full text-[15px] sm:text-base font-medium transition-all rounded-md data-[state=active]:bg-background data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
          aria-label="Search by image upload"
          role="tab"
          aria-selected={activeTab === 'image'}
          aria-controls="image-search-panel"
          id="image-search-tab"
        >
          <TabContent icon={Scan} text={t('tabs.search_by_image')} />
        </TabsTrigger>
        <TabsTrigger 
          value="advanced" 
          className="relative h-full text-[15px] sm:text-base font-medium transition-all rounded-md data-[state=active]:bg-background data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
          aria-label="Advanced search options"
          role="tab"
          aria-selected={activeTab === 'advanced'}
          aria-controls="advanced-search-panel"
          id="advanced-search-tab"
        >
          <TabContent icon={Search} text={t('tabs.advanced_search')} />
        </TabsTrigger>
      </TabsList>

      <TabsContent 
        value="image" 
        className="outline-none mt-3 sm:mt-6"
        role="tabpanel"
        id="image-search-panel"
        aria-labelledby="image-search-tab"
        tabIndex={activeTab === 'image' ? 0 : -1}
      >
        <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" aria-label="Loading image search" role="status" aria-live="polite" />}>
          <ImageSearchTab />
        </Suspense>
      </TabsContent>

      <TabsContent 
        value="advanced" 
        className="outline-none mt-3 sm:mt-6"
        role="tabpanel"
        id="advanced-search-panel"
        aria-labelledby="advanced-search-tab"
        tabIndex={activeTab === 'advanced' ? 0 : -1}
      >
        <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" aria-label="Loading advanced search" role="status" aria-live="polite" />}>
          <AdvancedSearchTab />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}