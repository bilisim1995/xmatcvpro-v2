'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
// import { useLanguage } from '@/components/contexts/LanguageContext'; // Removed useLanguage as t is not used for Detail button
import Image from 'next/image'; // Import Next.js Image component

export function PremiumBanner() {
  // const { t } = useLanguage(); // Removed useLanguage as t is not used for Detail button
  const BUNNY_NET_PULL_ZONE_HOSTNAME = 'cdn.xmatch.pro';
  const bannerImageUrl = `https://${BUNNY_NET_PULL_ZONE_HOSTNAME}/ads/p1.svg`; 

  return (
    <div 
      className="relative rounded-lg overflow-hidden group shadow-lg hover:shadow-xl dark:shadow-red-700/30 dark:hover:shadow-red-600/40 transition-all duration-300 mx-auto w-full"
      style={{ maxWidth: '895px', height: '290px' }} // Changed width to maxWidth, added w-full
    >
      {/* Background Image */}
      <Image
        src={bannerImageUrl}
        alt={"Advertisement Banner"} // Using a generic alt text
        layout="fill"
        objectFit="cover"
        className="group-hover:scale-105 transition-transform duration-500 ease-in-out"
        priority 
        onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.src = 'https://via.placeholder.com/895x290.png?text=Advertisement+Banner+Not+Found';
            e.currentTarget.srcset = '';
          }}
      />
      {/* Overlay to darken the image slightly for better button visibility if needed */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>

      {/* Content Overlay - Button Only */}
      <div className="absolute inset-0 flex items-end justify-start p-4"> {/* items-end justify-start for bottom-left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Button 
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 text-sm rounded-md shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => {
              console.log("Detail button clicked on banner");
              // window.open('YOUR_AD_LINK', '_blank'); // Example redirect
            }}
          >
            Detail {/* Changed text directly to Detail */}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}