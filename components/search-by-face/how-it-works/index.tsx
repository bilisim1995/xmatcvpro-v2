'use client';

import { Upload, Scan, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { StepCard } from './step-card';

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Photo",
      description: "Upload a photo of an actress or model you'd like to find similar matches for."
    },
    {
      icon: Scan,
      title: "Face Detection",
      description: "Our AI system automatically detects and analyzes facial features in your image."
    },
    {
      icon: Sparkles,
      title: "Get Results",
      description: "Browse through a curated list of matches with similarity scores."
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400"
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          How It Works
        </motion.h2>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Three simple steps to find your matches
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 * (index + 4) }}
          >
            <StepCard
              icon={step.icon}
              step={index + 1}
              title={step.title}
              description={step.description}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}