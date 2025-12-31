'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function Logo({ size = 100 }: { size?: number }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  let logoSrc = "/logo-b.png"; // Default to light mode logo

  useEffect(() => setMounted(true), []);

  if (mounted) {
    if (resolvedTheme === 'dark') {
      logoSrc = "/logo-r.png"; // Dark mode logo
    } else {
      logoSrc = "/logo-b.png"; // Light mode logo
    }
  }

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === '/') {
      window.location.reload();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <Link href="/" onClick={handleLogoClick} className="flex items-center space-x-2 group">
      <motion.div 
        whileHover={{ scale: 1.1, rotate: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        {mounted ? (
          <Image
            key={logoSrc}
            src={logoSrc} 
            alt="xmatch.pro Logo"
            width={size}
            height={size}
            className="rounded-md"
            priority
          />
        ) : (
          <div style={{ width: size, height: size }} className="bg-muted rounded-md"></div>
        )}
      </motion.div>
    </Link>
  );
}
