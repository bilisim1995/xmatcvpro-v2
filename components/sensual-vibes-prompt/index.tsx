'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Video } from 'lucide-react';

export function SensualVibesPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Always show the prompt after a short delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000); // 2-second delay

    return () => clearTimeout(timer);
  }, []);

  const handleYesClick = () => {
    router.push('/sensual-vibes');
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-muted/95 backdrop-blur-sm border-t border-border"
          style={{ height: '20vh' }}
        >
          <div className="container mx-auto h-full flex flex-col items-center justify-center text-center relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClose}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-lg md:text-xl font-semibold mb-4 text-foreground">
              <Video className="h-6 w-6 text-red-500" />
              <p>
                Want to watch reel videos of real people?
              </p>
            </div>
            
            <div className="flex gap-4">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Button onClick={handleYesClick} size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  Yes
                </Button>
              </motion.div>
              <Button onClick={handleClose} size="lg" variant="outline">
                No
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
