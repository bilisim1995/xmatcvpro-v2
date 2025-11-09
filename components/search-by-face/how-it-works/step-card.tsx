'use client';

import { DivideIcon as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface StepCardProps {
  icon: typeof LucideIcon;
  step: number;
  title: string;
  description: string;
}

export function StepCard({ icon: Icon, step, title, description }: StepCardProps) {
  return (
    <Card className="relative p-6 h-full group hover:shadow-lg transition-all duration-300">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-600/5 to-red-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
        whileHover={{ scale: 1.02 }}
      />
      
      <motion.div className="relative flex flex-col h-full">
        <div className="flex items-center justify-between">
          <motion.div 
            className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 group-hover:scale-110 transition-transform duration-300"
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-6 h-6 text-red-600" />
          </motion.div>
          
          <motion.span 
            className="text-sm font-medium text-muted-foreground"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
          >
            Step {step}
          </motion.span>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3 group-hover:text-red-600 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground mt-2">
          {description}
        </p>
      </motion.div>
    </Card>
  );
}