'use client';

import { ExternalLink, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, User, Ruler, Scale, Globe2 } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';
import { SearchResult } from '@/lib/api/types';
import { VideoModal } from '../video-modal/video-modal';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface ResultCardProps {
  result: SearchResult;
  index: number;
  showConfidence?: boolean;
}

const formatValue = (value: any, unit?: string) => {
  if (!value) return 'Not specified';
  return unit ? `${value} ${unit}` : value;
};

export function ResultCard({ result, index, showConfidence = true }: ResultCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!result || !result.name) {
    return null;
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={result.image} 
          alt={result.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Ranking Number */}
        <div className="absolute top-2 left-2">
          <div className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white font-bold">
            #{index + 1}
          </div>
        </div>
        
        {/* Best Match Badge */}
        {index === 0 && showConfidence && result.confidence && result.confidence > 0 && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-red-600 hover:bg-red-700">
              Best Match
            </Badge>
          </div>
        )}
        
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Name and Similarity */}
        <div className="space-y-2">
          <h3 className="font-medium truncate">{result.name}</h3>
          {showConfidence && result.confidence && result.confidence > 0 && (
            <>
              <div className="h-1.5 bg-red-100 dark:bg-red-900/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              <p className="text-sm font-medium text-red-600 text-right">
                {result.confidence?.toFixed(1)}% Match
              </p>
            </>
          )}
        </div>
        
        {/* Model Bilgileri */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline"
              className="w-full justify-between hover:bg-red-50 dark:hover:bg-red-900/20 border-dashed"
            >
              <span className="text-sm">Physical Attributes</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4 animate-accordion-down">
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-red-600" />
                  <span className="text-muted-foreground">Age</span>
                </div>
                <div className="text-right">{formatValue(result.age, 'y/o')}</div>
                
                <div className="flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-red-600" />
                  <span className="text-muted-foreground">Height</span>
                </div>
                <div className="text-right">{formatValue(result.height, 'cm')}</div>
                
                <div className="flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-red-600" />
                  <span className="text-muted-foreground">Weight</span>
                </div>
                <div className="text-right">{formatValue(result.weight, 'kg')}</div>
              </div>

              <Separator />
              
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-red-600" />
                  <span className="text-muted-foreground">Ethnicity</span>
                </div>
                <div className="text-right">{formatValue(result.ethnicity)}</div>
              </div>
            </div>
          
            <div className="flex flex-wrap gap-1.5">
              {result.cup_size && (
                <Badge variant="outline" className="text-xs bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20">
                  Cup: {result.cup_size}
                </Badge>
              )}
              {result.hair && (
                <Badge variant="outline" className="text-xs bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20">
                  Hair: {result.hair}
                </Badge>
              )}
              {result.eyes && (
                <Badge variant="outline" className="text-xs bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20">
                  Eyes: {result.eyes}
                </Badge>
              )}
              {result.piercings === 'yes' && (
                <Badge variant="outline" className="text-xs bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20">
                  Piercings: Yes
                </Badge>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/models/${result.slug || result.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="w-full"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full"
            >
              <span>Profile</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </Link>
          <VideoModal 
            modelName={result.name}
            videoUrl={result.link1 || ''}
            trigger={
              <Button
                variant="default"
                size="sm"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Video className="w-4 h-4 mr-2" />
                Videos
              </Button>
            }
          />
        </div>
      </div>
    </Card>
  );
}