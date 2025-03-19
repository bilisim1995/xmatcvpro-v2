'use client';

import { LucideIcon } from 'lucide-react';

interface StatsSectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

export function StatsSection({ icon: Icon, title, children }: StatsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-red-600" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}