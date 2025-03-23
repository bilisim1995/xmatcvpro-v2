'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function UploadAnimation() {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {/* Outer glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full blur-xl" />
          
          {/* Spinner */}
          <div className="relative">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          </div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground"
        >
          Processing image...
        </motion.p>
      </div>
    </div>
  );
}