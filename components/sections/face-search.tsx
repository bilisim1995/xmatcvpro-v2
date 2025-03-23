'use client';

import { MoveRight, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function FaceSearch() {
  const router = useRouter();

  const handleStartSearch = () => {
    router.push('/search');
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 border-t bg-card/50">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Side - Image */}
        <motion.div
          className="relative max-w-sm mx-auto w-full aspect-square rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
            alt="Face Search Demo"
            className="w-full h-full object-cover object-center"
          />
          
          {/* Scanning Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-red-500/30 to-transparent backdrop-blur-sm"
            initial={{ y: '-100%' }}
            animate={{ y: '100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </motion.div>

        {/* Right Side - Content */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block p-4 bg-red-100 dark:bg-red-900/20 rounded-xl"
          >
            <Scan className="w-8 h-8 text-red-600" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold"
          >
            Pornstars Search by Face with AI
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground"
          >
            Upload any face photo and our AI will find matching adult performers from our extensive database.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                <span>Advanced facial recognition AI</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                <span>1M+ performer database</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                <span>99% accuracy rate</span>
              </li>
            </ul>

            <Button
              onClick={handleStartSearch}
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Try Face Search
              <MoveRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}