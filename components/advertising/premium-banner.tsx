'use client';

import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, BarChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PremiumBanner() {
  const stats = [
    { icon: Users, value: '1M+', label: 'Monthly Users' },
    { icon: TrendingUp, value: '50K+', label: 'Daily Searches' },
    { icon: BarChart, value: '99%', label: 'Accuracy Rate' }
  ];

  return (
    <Card className="relative overflow-hidden">
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

      <div className="relative p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/20 animate-pulse"
            >
              <DollarSign className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">Premium Advertising</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold"
            >
              Premium Banner Ads
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              High-visibility banner placements across our platform. Reach millions of engaged users with premium advertising spots.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
                onClick={() => window.open('https://t.me/xmatchpro', '_blank')}
              >
                Get Started
              </Button>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * (index + 2) }}
                className="text-center p-3 rounded-lg bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-1.5 text-red-600" />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}