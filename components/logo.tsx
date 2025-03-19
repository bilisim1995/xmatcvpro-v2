'use client';

import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <img
        src="/logo.png"
        alt="xmatch.pro"
        style={{ width: '120px', height: '28px' }}
        className="dark:brightness-200"
      />
    </Link>
  );
}