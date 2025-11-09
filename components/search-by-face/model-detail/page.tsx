'use client';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { VideoModal } from '@/components/search-by-face/video-modal/video-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchResult } from '@/lib/api/types';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { User, Ruler, Scale, Globe2, Video, Link as LinkIcon, Globe, Instagram, Twitter } from 'lucide-react';
import { SuggestedModels } from './suggested-models';
import { useLanguage } from '@/components/contexts/LanguageContext';
import { WatermarkedImage } from '../shared/watermarked-image';

const socialMediaIcons = {
  www: Globe,
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  onlyfans: Video,
  onlyfansfree: Video,
  imdb: Video
};

const socialMediaLabels = {
  www: 'Website',
  instagram: 'Instagram',
  twitter: 'Twitter',
  x: 'X (Twitter)',
  onlyfans: 'OnlyFans',
  onlyfansfree: 'OnlyFans (Free)',
  imdb: 'IMDB'
};

interface ModelDetailPageProps {
  model: SearchResult;
}

export function ModelDetailPage({ model }: ModelDetailPageProps) {
  const { t } = useLanguage();
  const [suggestedModels, setSuggestedModels] = useState<SearchResult[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestedModels = async () => {
      try {
        setIsLoadingSuggestions(true);

        // Fetch models with similar attributes
        const params = new URLSearchParams({
          ...(model.ethnicity && { ethnicity: model.ethnicity }),
          ...(model.age && { age: model.age.toString() }),
          ...(model.hair && { hair_color: model.hair }),
          ...(model.eyes && { eye_color: model.eyes })
        });

        // If no params, fetch random models
        const url = params.toString() 
          ? `/api/models?${params.toString()}`
          : '/api/models?random=true';
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch suggested models');

        const data = await response.json();
        console.log('Suggested models data:', data);
        // Filter out the current model and limit to 5 suggestions
        const filtered = data
          .filter((m: SearchResult) => {
            const hasImage = m.image && m.image.trim() !== '';
            if (!hasImage) {
              console.warn('Model without image:', m.name, m);
            }
            return m.id !== model.id && hasImage;
          })
          .slice(0, 5);
        console.log('Filtered suggested models:', filtered);

        // If still no results, try random
        if (filtered.length === 0 && params.toString()) {
          const randomResponse = await fetch('/api/models?random=true');
          if (randomResponse.ok) {
            const randomData = await randomResponse.json();
            const randomFiltered = randomData
              .filter((m: SearchResult) => m.id !== model.id && m.image && m.image.trim() !== '')
              .slice(0, 5);
            setSuggestedModels(randomFiltered);
            return;
          }
        }

        setSuggestedModels(filtered);
      } catch (error) {
        console.error('Error fetching suggested models:', error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    if (model) {
      fetchSuggestedModels();
    }
  }, [model]);

  if (!model) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">{t('modeldetail.model_not_found')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('modeldetail.model_not_found_description')}
          </p>
          <Button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
          >
            {t('modeldetail.go_back')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <main id="main-content" className="min-h-screen pt-24">
      {/* Main Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Left Column - Image */}
          <motion.div
            className="md:col-span-4 lg:col-span-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="space-y-4 sticky top-24">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative">
                <WatermarkedImage 
                  src={model.image} 
                  alt={model.name}
                  className="w-full aspect-[3/4] object-cover"
                  watermarkSize="large"
                />
              </Card>
              
              {/* Social Media Links */}
              {model.social_media && (
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(model.social_media)
                    .filter(([_, url]) => url) // Only show links that exist
                    .map(([platform, url]) => {
                      const Icon = socialMediaIcons[platform as keyof typeof socialMediaIcons] || LinkIcon;
                      const label = socialMediaLabels[platform as keyof typeof socialMediaLabels] || platform;
                      
                      return (
                        <Button
                          key={platform}
                          variant="outline"
                          size="lg"
                          asChild
                          className="w-full hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-2"
                          >
                            <span className="flex items-center gap-2">
                              <Icon className="w-5 h-5" />
                              <span className="text-sm font-medium">{label}</span>
                            </span>
                            <LinkIcon className="w-4 h-4 opacity-50" />
                          </a>
                        </Button>
                      );
                    })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            className="md:col-span-8 lg:col-span-9 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Name and Social Media */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-500">
                {model.name}
              </h1>
            </div>

            <Separator />

            {/* Physical Attributes Grid */}
            <section>
              <Card className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-foreground">{t('modeldetail.physical_attributes')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {model.age && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-muted-foreground">{t('modeldetail.age')}</span>
                    </div>
                    <p className="text-lg font-semibold">{model.age} y/o</p>
                  </div>
                )}
                {model.height && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-muted-foreground">{t('modeldetail.height')}</span>
                    </div>
                    <p className="text-lg font-semibold">{model.height} cm</p>
                  </div>
                )}
                {model.weight && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-muted-foreground">{t('modeldetail.weight')}</span>
                    </div>
                    <p className="text-lg font-semibold">{model.weight} kg</p>
                  </div>
                )}
                {model.ethnicity && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe2 className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-muted-foreground">{t('modeldetail.ethnicity')}</span>
                    </div>
                    <p className="text-lg font-semibold">{model.ethnicity}</p>
                  </div>
                )}
              </div>
              </Card>
            </section>

            {/* Additional Features */}
            <section>
              <Card className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-foreground">{t('modeldetail.features')}</h2>
              <div className="flex flex-wrap gap-2 text-foreground">
                {model.cup_size && (
                  <Badge className="px-3 py-1.5 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-foreground">
                    {t('modeldetail.cup_size')} {model.cup_size}
                  </Badge>
                )}
                {model.hair && (
                  <Badge className="px-3 py-1.5 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-foreground">
                    {t('modeldetail.hair')} {model.hair}
                  </Badge>
                )}
                {model.eyes && (
                  <Badge className="px-3 py-1.5 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-foreground">
                    {t('modeldetail.eyes')} {model.eyes}
                  </Badge>
                )}
                {model.tats === 'yes' && (
                  <Badge className="px-3 py-1.5 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-foreground">
                    {t('modeldetail.has_tattoos')}
                  </Badge>
                )}
                {model.piercings === 'yes' && (
                  <Badge className="px-3 py-1.5 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-foreground">
                    {t('modeldetail.has_piercings')}
                  </Badge>
                )}
              </div>
              </Card>
            </section>
            
            {/* Biography */}
            {model.description && (
              <section>
                <Card className="p-6 space-y-4">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">{t('modeldetail.biography')}</h2>
                  <div className="max-h-[300px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-red-200 dark:scrollbar-thumb-red-800 scrollbar-track-transparent">
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                      {model.description}
                    </p>
                  </div>
                </div>
                </Card>
              </section>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <VideoModal
                modelName={model.name}
                videoUrl={model.link1 || ''}
                trigger={
                  <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Video className="w-5 h-5 mr-2" />
                    {t('modeldetail.watch_videos')}
                  </Button>
                }
              />
            </div>
          </motion.div>
        </div>

        {/* Suggested Models */}
        {!isLoadingSuggestions && suggestedModels.length > 0 && (
          <section aria-label="You May Also Like">
            <SuggestedModels models={suggestedModels} />
          </section>
        )}
      </article>
    </main>
  );
}