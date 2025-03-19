'use client';

import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MetricsCardProps {
  icon: LucideIcon;
  value: string;
  title: string;
  description: string;
}

export function MetricsCard({ icon: Icon, value, title, description }: MetricsCardProps) {
  return (
    <Card className="p-4 relative group hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20">
          <Icon className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}