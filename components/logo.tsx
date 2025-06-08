'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Logo() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  let logoSrc = "/logo-r.png"; // Default to light mode logo or a generic one

  useEffect(() => setMounted(true), []);

  if (mounted) {
    if (resolvedTheme === 'dark') {
      logoSrc = "/logo-b.png"; // Dark mode logo
    } else {
      logoSrc = "/logo-r.png"; // Light mode logo
    }
  }
  // To prevent flash of wrong logo during initial hydration or if theme is not yet resolved,
  // you might want to return a placeholder or null if !mounted and rely on useEffect to update.
  // However, for simplicity, we let it default and update.

  return (
    <Link href="/" className="flex items-center space-x-2 group">
      <motion.div 
        whileHover={{ scale: 1.1, rotate: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        {mounted ? (
          <Image
            key={logoSrc} // Add key to force re-render on src change if necessary
            src={logoSrc} 
            alt="xmatch.pro Logo"
            width={40}
            height={40}
            className="rounded-md"
            priority
          />
        ) : (
          // Placeholder while theme is resolving to prevent layout shift / show a generic state
          <div style={{ width: 40, height: 40 }} className="bg-muted rounded-md"></div>
        )}
      </motion.div>
      <motion.span 
        className="font-bold text-xl hidden sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 group-hover:from-red-500 group-hover:to-red-300 transition-colors"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        xmatch.pro
      </motion.span>
    </Link>
  );
}
