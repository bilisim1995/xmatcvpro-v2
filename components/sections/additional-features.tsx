'use client';

import { Shield, Clock, Users, Zap } from 'lucide-react';

export function AdditionalFeatures() {
  const features = [
    { icon: Shield, text: "Secure & Private" },
    { icon: Clock, text: "24/7 Available" },
    { icon: Users, text: "Large Database" },
    { icon: Zap, text: "Fast Processing" }
  ];

  return (
    <div className="container mx-auto px-4 pb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {features.map((Feature, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-card rounded-lg hover:bg-card/80 transition-colors text-center sm:text-left">
            <Feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            <span className="text-base sm:text-lg font-medium">{Feature.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}