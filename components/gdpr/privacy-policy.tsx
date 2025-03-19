'use client';

import { Card } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, Clock, UserCheck } from 'lucide-react';

export function PrivacyPolicy() {
  const sections = [
    {
      icon: Shield,
      title: "Data Protection",
      content: "We implement appropriate technical and organizational measures to ensure the security of your personal data."
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "All data is encrypted in transit and at rest using industry-standard encryption protocols."
    },
    {
      icon: Eye,
      title: "Data Privacy",
      content: "We process your data only for the purposes explicitly stated and with your consent."
    },
    {
      icon: Database,
      title: "Data Storage",
      content: "Your data is stored securely within the EU/EEA in compliance with GDPR regulations."
    },
    {
      icon: Clock,
      title: "Data Retention",
      content: "We only keep your data for as long as necessary and you can request deletion at any time."
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal data at any time."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Privacy Policy</h2>
        <p className="text-muted-foreground">How we protect and handle your data</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <Card key={index} className="p-6">
            <section.icon className="w-8 h-8 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            <p className="text-sm text-muted-foreground">{section.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}