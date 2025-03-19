'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

const AiAvatar = ({ delay = 0 }) => (
  <motion.div
    className="relative"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay }}
  >
    {/* Glow Effect */}
    <motion.div
      className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.8, 0.5]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    
    {/* Avatar Circle */}
    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 p-0.5">
      <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
        <Brain className="w-6 h-6 text-red-600" />
      </div>
    </div>
    
    {/* Processing Indicators */}
    <motion.div
      className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-red-500"
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay * 0.2
      }}
    >
      <Sparkles className="w-full h-full text-white" />
    </motion.div>
  </motion.div>
);

export function SearchDemoAnimation() {
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-red-500/5 to-red-600/5 shadow-xl border">
      {/* Background Neural Network Pattern */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-[1px] bg-gradient-to-r from-red-500/0 via-red-600/10 to-red-500/0"
            style={{
              top: `${i * 5}%`,
              left: 0,
              transform: `rotate(${i % 2 ? 45 : -45}deg)`
            }}
            animate={{
              opacity: [0, 0.5, 0],
              translateX: ["-100%", "100%"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Source Image */}
      <motion.div 
        className="absolute left-8 top-1/2 -translate-y-1/2 w-32 h-32 rounded-lg overflow-hidden border-2 border-red-500/30"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <img 
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2" 
          alt="Source" 
          className="w-full h-full object-cover"
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

      {/* AI Processing Circle */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* AI Avatars Circle */}
        <div className="relative w-32 h-32">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                transform: `rotate(${i * 45}deg) translateY(-40px)`
              }}
            >
              <motion.div
                style={{
                  transform: `rotate(-${i * 45}deg)`
                }}
              >
                <AiAvatar delay={i * 0.1} />
              </motion.div>
            </motion.div>
          ))}

          {/* Center Brain */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 p-0.5">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <Brain className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Result Images */}
      <motion.div 
        className="absolute right-8 top-1/2 -translate-y-1/2 flex gap-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-24 h-24 rounded-lg overflow-hidden border-2 border-red-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 + i * 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2" 
              alt={`Result ${i + 1}`} 
              className="w-full h-full object-cover"
            />
            {/* Match Percentage */}
            <motion.div
              className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs text-center py-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 + i * 0.2 }}
            >
              {98 - i * 3}% Match
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}