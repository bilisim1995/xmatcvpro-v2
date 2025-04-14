'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/components/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'ru', label: 'RU', flag: '🇷🇺' },
    { code: 'hi', label: 'HI', flag: '🇮🇳' },
    { code: 'zh', label: 'ZH', flag: '🇨🇳' },
    { code: 'de', label: 'DE', flag: '🇩🇪' },
    { code: 'tr', label: 'TR', flag: '🇹🇷' }
  ];

  const current = languages.find((l) => l.code === language);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-md border bg-white dark:bg-gray-800 dark:text-white cursor-pointer shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <span>{current?.flag}</span>
        <span className="text-xs font-medium">{current?.label}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 transition-all duration-200 transform origin-top scale-95 animate-fade-in">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as 'en' | 'tr' | 'ru' | 'hi' | 'de' | 'zh');
                  setOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  lang.code === language ? 'font-bold' : ''
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}