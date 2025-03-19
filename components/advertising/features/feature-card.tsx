'use client';

import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-4 space-y-2">
      <div className="p-2 w-fit rounded-lg bg-red-100 dark:bg-red-900/20">
        <Icon className="w-5 h-5 text-red-600" />
      </div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </Card>
  );
}