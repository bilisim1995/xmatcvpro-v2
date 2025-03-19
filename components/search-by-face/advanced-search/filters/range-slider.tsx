'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

interface RangeValue {
  min?: number;
  max?: number;
}

interface RangeSliderProps {
  label: string;
  value?: RangeValue;
  onChange: (value: RangeValue) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export function RangeSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit
}: RangeSliderProps) {
  const [range, setRange] = useState<[number, number]>([
    value?.min ?? min,
    value?.max ?? max
  ]);

  useEffect(() => {
    setRange([value?.min ?? min, value?.max ?? max]);
  }, [value, min, max]);

  const handleChange = (newValue: number[]) => {
    const [newMin, newMax] = newValue;
    setRange([newMin, newMax]);
    onChange({ min: newMin, max: newMax });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${range[0]}-${range[1]}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full"
          >
            {range[0] === range[1] ? (
              <span>{range[0]}{unit}</span>
            ) : (
              <span>{range[0]}-{range[1]}{unit}</span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-1">
        <Slider
          defaultValue={[range[0], range[1]]}
          value={[range[0], range[1]]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleChange}
          className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
          thumbClassName="border-2 border-primary bg-background hover:scale-110 transition-transform"
          trackClassName="bg-primary/20 [&[data-highlighted]]:bg-primary"
        />
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground px-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}