'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/contexts/LanguageContext';

export function SponsoredContent() {
  const { t } = useLanguage();

  return (
    <Card className="relative overflow-hidden mt-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-600/5 to-red-500/5" />
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-[1px] bg-gradient-to-r from-red-500/0 via-red-600/10 to-red-500/0"
            style={{
              top: `${i * 25}%`,
              transform: `rotate(${i % 2 ? 45 : -45}deg)`
            }}
            animate={{
              opacity: [0, 0.5, 0],
              translateX: ["-100%", "100%"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative p-4 md:p-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/20 animate-pulse"
            >
              <Megaphone className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">{t('sponsoredcontent.sponsored_content')}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold"
            >
              {t('sponsoredcontent.premium_banner_ads')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm text-muted-foreground line-clamp-2"
            >
              {t('sponsoredcontent.premium_banner_description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                size="sm"
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
                onClick={() => window.open('https://t.me/xmatchpro', '_blank')}
              >
                {t('sponsoredcontent.get_started')}
              </Button>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: '250K+', label: t('sponsoredcontent.monthly_users') },
              { value: '50K+', label: t('sponsoredcontent.daily_searches') },
              { value: '99%', label: t('sponsoredcontent.accuracy_rate') }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * (index + 2) }}
                className="text-center p-2 rounded-lg bg-background/50 backdrop-blur-sm shadow hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}