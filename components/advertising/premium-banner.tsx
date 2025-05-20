'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/contexts/LanguageContext';
import Image from 'next/image'; // Import Next.js Image component

export function PremiumBanner() {
  const { t } = useLanguage(); // t fonksiyonu hala alt text için kullanılabilir
  const BUNNY_NET_PULL_ZONE_HOSTNAME = 'cdn.xmatch.pro';
  const bannerImageUrl = `https://${BUNNY_NET_PULL_ZONE_HOSTNAME}/ads/p1.svg`; // Changed to p1.svg

  return (
    <div 
      className="relative rounded-lg overflow-hidden group shadow-lg hover:shadow-xl dark:shadow-red-700/30 dark:hover:shadow-red-600/40 transition-all duration-300 mx-auto"
      style={{ width: '895px', height: '290px' }} // Fixed size and centered with mx-auto
    >
      {/* Background Image */}
      <Image
        src={bannerImageUrl}
        alt={t('premium_banner.banner_title', "Advertisement Banner")} // Fallback alt text
        layout="fill"
        objectFit="cover" // Keep as cover to fill the fixed dimensions
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
              // Gerekirse butona bir aksiyon eklenebilir, örneğin reklam sayfasına yönlendirme
              console.log("Detail button clicked on banner");
              // window.open('YOUR_AD_LINK', '_blank'); // Örnek yönlendirme
            }}
          >
            Detail
          </Button>
        </motion.div>
      </div>
    </div>
  );
}