'use client';

import { motion } from 'framer-motion';

export function SearchHeader() {
  return (
    <div className="text-center mb-6 sm:mb-12">
      <motion.h1 
        className="text-xl sm:text-4xl mt-6 md:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        PORNSTAR SEARCH BY FACE WITH AI
      </motion.h1>
      <motion.p 
        className="text-xs sm:text-lg text-muted-foreground max-w-2xl mx-auto px-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Upload any face photo and our AI will find matching pornstar models from our extensive database.
      </motion.p>
    </div>
  );
}