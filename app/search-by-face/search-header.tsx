'use client';

import { motion } from 'framer-motion';

export function SearchHeader() {
  return (
    <div className="text-center mb-12">
      <motion.h1  
        className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 flex flex-wrap justify-center gap-x-4 gap-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        SEARCH BY FACE WITH AI
      </motion.h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Upload any face photo and our AI will find matching models from our extensive database.
      </p>
    </div>
  );
}