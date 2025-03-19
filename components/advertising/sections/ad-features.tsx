'use client';

import { Target, Rocket } from 'lucide-react';
import { FeatureCard } from '../features/feature-card';

export function AdFeatures() {
  return (
    <section className="space-y-4">
      <p className="text-lg text-muted-foreground">
        Reach millions of users worldwide through strategic advertising opportunities on xmatch.pro
      </p>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <FeatureCard
          icon={Target}
          title="Targeted Audience"
          description="Access a highly engaged adult entertainment audience"
        />
        
        <FeatureCard
          icon={Rocket}
          title="Premium Placement"
          description="Strategic ad positions for maximum visibility"
        />
      </div>
    </section>
  );
}