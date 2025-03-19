'use client';

import { Card } from '@/components/ui/card';
import { DollarSign, Video } from 'lucide-react';

const adOptions = [
  {
    title: 'Premium Banner Ads',
    description: 'High-visibility banner placements across our platform',
    icon: DollarSign
  },
  {
    title: 'Sponsored Content',
    description: 'Native advertising integrated into search results',
    icon: DollarSign
  },
  {
    title: 'Sponsored Videos',
    description: 'Premium video placement and recommendations',
    icon: Video
  },
  {
    title: 'Partnership Opportunities',
    description: 'Long-term collaboration and co-branding options',
    icon: DollarSign
  }
];

export function AdOptions() {
  return (
    <div className="space-y-4">
      {adOptions.map((option, index) => (
        <Card key={index} className="p-4 space-y-2 hover:bg-accent/50 transition-colors">
          <h4 className="font-medium flex items-center gap-2">
            <option.icon className="w-4 h-4 text-red-600" />
            {option.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {option.description}
          </p>
        </Card>
      ))}
    </div>
  );
}