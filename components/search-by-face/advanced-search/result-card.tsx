'use client';

import { ExternalLink, User, Ruler, Scale, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchResult } from '@/lib/api/types';
import { VideoModal } from '../video-modal/video-modal';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

interface AdvancedSearchResultCardProps {
  result: SearchResult;
  index: number;
}

export function AdvancedSearchResultCard({ result }: AdvancedSearchResultCardProps) {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push(`/models/${result.id}`);
  };

  const modelInfo = [
    {
      icon: User,
      label: 'Age',
      value: result.age,
      unit: 'y/o'
    },
    {
      icon: Ruler,
      label: 'Height',
      value: result.height,
      unit: 'cm'
    },
    {
      icon: Scale,
      label: 'Weight',
      value: result.weight,
      unit: 'kg'
    },
    {
      icon: Globe2,
      label: 'Ethnicity',
      value: result.ethnicity
    }
  ].filter(info => info.value);

  const features = [
    { label: 'Cup', value: result.cup_size },
    { label: 'Hair', value: result.hair },
    { label: 'Eyes', value: result.eyes },
    { label: 'Tattoos', value: result.tats === 'yes' ? 'Yes' : undefined },
    { label: 'Piercings', value: result.piercings === 'yes' ? 'Yes' : undefined }
  ].filter(f => f.value);

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={result.image} 
          alt={result.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Name */}
        <h3 className="font-medium text-lg truncate">{result.name}</h3>
        
        {/* Main Info */}
        <div className="grid grid-cols-2 gap-2">
          {modelInfo.map((info, i) => (
            <div key={i} className="flex items-center gap-1.5 text-sm">
              <info.icon className="w-4 h-4 text-red-600" />
              <span className="text-muted-foreground">{info.value}{info.unit}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Additional Features */}
        <div className="flex flex-wrap gap-1.5">
          {features.map((feature, i) => (
            <Badge 
              key={i} 
              variant="secondary" 
              className="text-xs px-2 py-0.5 whitespace-nowrap bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              {feature.label}: {feature.value}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleProfileClick}
          >
            <span>Profile</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
          <VideoModal 
            modelName={result.name}
            videoUrl={result.link1 || ''}
          />
        </div>
      </div>
    </Card>
  );
}