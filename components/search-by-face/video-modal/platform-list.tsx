'use client';

import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdModal } from '@/components/advertising/ad-modal';

interface PlatformListProps {
  videoUrl: string;
  onSelect: () => void;
}

export function PlatformList({ videoUrl, onSelect }: PlatformListProps) {
  const handlePlatformClick = () => {
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
    onSelect();
  };

  return (
    <motion.div 
      className="grid gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* XVideos Button */}
      <motion.button
        className="flex items-center justify-between p-4 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
        onClick={handlePlatformClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-white text-sm font-bold">X</span>
          </div>
          <div className="text-left">
            <p className="font-medium">XVideos</p>
            <p className="text-xs text-white/70">Most popular adult content platform</p>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-white/70" />
      </motion.button>

      {/* Sponsored Videos Button */}
      <AdModal trigger={
        <motion.button
          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <span className="text-xs font-medium text-red-600">AD</span>
            </div>
            <div className="text-left">
              <p className="font-medium">Sponsored Videos</p>
              <p className="text-xs text-muted-foreground">Premium content partners</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      } />
    </motion.div>
  );
}