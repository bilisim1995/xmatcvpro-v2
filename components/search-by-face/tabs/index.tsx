'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Scan } from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

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

  const TabContent = ({ icon: Icon, text }: { icon: typeof Search; text: string }) => {
    return (
      <motion.div
        className="flex items-center justify-center gap-3 w-full"
        variants={tabVariants}
        initial="inactive"
        animate="active"
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span>{text}</span>
      </motion.div>
    );
  };

  return (
    <Tabs 
      defaultValue="image" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full space-y-8"
    >
      <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-muted/50 rounded-lg">
        <TabsTrigger 
          value="image" 
          className="relative h-full text-base font-medium transition-all rounded-md data-[state=active]:bg-background data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
        >
          <TabContent icon={Scan} text="Search by Image" />
        </TabsTrigger>
        <TabsTrigger 
          value="advanced" 
          className="relative h-full text-base font-medium transition-all rounded-md data-[state=active]:bg-background data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
        >
          <TabContent icon={Search} text="Advanced Search" />
        </TabsTrigger>
      </TabsList>

      <TabsContent value="image" className="outline-none mt-6">
        <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" />}>
          <ImageSearchTab />
        </Suspense>
      </TabsContent>

      <TabsContent value="advanced" className="outline-none mt-6">
        <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" />}>
          <AdvancedSearchTab />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}