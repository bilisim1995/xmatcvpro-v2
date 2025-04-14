'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export function Logo() {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/logo-r.png' : '/logo-b.png';

  return (
    <Link href="/" className="flex items-center">
      <Image
        src={logoSrc}
        alt="xmatch.pro"
        width={120}
        height={35}
        className="transition-all duration-300"
        priority
      />
    </Link>
  );
}
