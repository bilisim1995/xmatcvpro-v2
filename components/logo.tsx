'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/logo.png"
        alt="xmatch.pro"
        width={120}
        height={35}
        className="dark:brightness-200"
        priority
      />
    </Link>
  );
}
