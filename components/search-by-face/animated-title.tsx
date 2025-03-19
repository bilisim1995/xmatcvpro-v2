'use client';

import { motion } from 'framer-motion';

export function AnimatedTitle() {

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { 
      y: 20, 
      opacity: 0,
      scale: 0.8,
      rotate: -5
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
  };

  return (
    <div className="text-center mb-12">
      <motion.h1 
        className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 flex flex-wrap justify-center gap-x-4 gap-y-2"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {['SEARCH', 'BY', 'FACE', 'WITH', 'AI'].map((word) => (
          <motion.span
            key={word}
            variants={item}
            className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 relative"
          >
            {word}
            <motion.div
              className="absolute inset-0 bg-red-500/10 blur-xl -z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1.2 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.span>
        ))}
      </motion.h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Upload any face photo and our AI will find matching models from our extensive database.
      </p>
    </div>
  );
}