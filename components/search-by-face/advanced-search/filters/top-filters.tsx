'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModelFilters } from '@/lib/api/types';
import { useEffect, useState } from 'react';

interface TopFiltersProps {
  filters: ModelFilters;
  onChange: (filters: ModelFilters) => void;
}

const cupSizes = [
  { value: 'a', label: 'A Cup' },
  { value: 'b', label: 'B Cup' },
  { value: 'c', label: 'C Cup' },
  { value: 'd', label: 'D Cup' },
  { value: 'dd', label: 'DD Cup' },
  { value: 'ddd', label: 'DDD Cup' },
  { value: 'e', label: 'E Cup' },
  { value: 'f', label: 'F Cup' },
  { value: 'g', label: 'G Cup' }
];

export function TopFilters({ filters, onChange }: TopFiltersProps) {
  const [selectedCupSize, setSelectedCupSize] = useState(filters.cup_size || 'any');

  // Filters değiştiğinde state'i güncelle
  useEffect(() => {
    setSelectedCupSize(filters.cup_size || 'any');
  }, [filters.cup_size]);

  const updateFilter = (key: keyof ModelFilters, value: any) => {
    if (value === "any") {
      const newFilters = { ...filters };
      delete newFilters[key];
      onChange(newFilters);
      if (key === 'cup_size') {
        setSelectedCupSize('any');
      }
      return;
    }
    if (key === 'cup_size') {
      setSelectedCupSize(value);
    }
    onChange({ ...filters, [key]: value });
  };

  useEffect(() => {
    // Reset select values when filters are cleared
    const selectElements = document.querySelectorAll('[data-radix-select-trigger]');
    if (Object.keys(filters).length === 0) {
      selectElements.forEach((select) => {
        const value = select.getAttribute('data-value');
        if (value) {
          select.setAttribute('data-value', '');
        }
      });
      setSelectedCupSize('any');
    }
  }, [filters, setSelectedCupSize]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label>Hair Color</Label>
        <Select 
          value={filters.hair_color || 'any'}
          onValueChange={value => updateFilter('hair_color', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select hair color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="blonde">Blonde</SelectItem>
            <SelectItem value="brown">Brown</SelectItem>
            <SelectItem value="black">Black</SelectItem>
            <SelectItem value="red">Red</SelectItem>
            <SelectItem value="auburn">Auburn</SelectItem>
            <SelectItem value="grey">Grey</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Eye Color</Label>
        <Select 
          value={filters.eye_color || 'any'}
          onValueChange={value => updateFilter('eye_color', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select eye color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="blue">Blue</SelectItem>
            <SelectItem value="green">Green</SelectItem>
            <SelectItem value="brown">Brown</SelectItem>
            <SelectItem value="hazel">Hazel</SelectItem>
            <SelectItem value="grey">Grey</SelectItem>
            <SelectItem value="amber">Amber</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Cup Size</Label>
        <Select 
          value={filters.cup_size || 'any'}
          onValueChange={value => updateFilter('cup_size', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select cup size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {cupSizes.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}