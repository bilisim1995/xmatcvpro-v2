'use client';

import { Cookie } from 'next/font/google';
import { useLanguage } from '@/components/contexts/LanguageContext';

const cookie = Cookie({ weight: '400', subsets: ['latin'] });

export function CoffeeButton() {
  const { t } = useLanguage(); 
  return (
    <div className="flex justify-center items-center">
      <a
        href="https://buymeacoffee.com/xmatchpro"
        target="_blank"
        rel="noopener noreferrer"
        className={`${cookie.className} bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-md shadow-md text-2xl flex items-center gap-2 transition-all duration-200`}
      >
        <span role="img" aria-label="condom">🍆</span>
        {t('coffeebutton.buy_me_a_coffee')} :)
      </a>
    </div>
  );
}
