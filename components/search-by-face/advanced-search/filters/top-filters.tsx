'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModelFilters } from '@/lib/api/types';

interface TopFiltersProps {
  filters: ModelFilters;
  onChange: (filters: ModelFilters) => void;
}

export function TopFilters({ filters, onChange }: TopFiltersProps) {
  const updateFilter = (key: keyof ModelFilters, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label>Hair Color</Label>
        <Select 
          value={filters.hair_color} 
          onValueChange={value => updateFilter('hair_color', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select hair color" />
          </SelectTrigger>
          <SelectContent>
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
          value={filters.eye_color} 
          onValueChange={value => updateFilter('eye_color', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select eye color" />
          </SelectTrigger>
          <SelectContent>
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
          value={filters.cup_size} 
          onValueChange={value => updateFilter('cup_size', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select cup size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">A Cup</SelectItem>
            <SelectItem value="b">B Cup</SelectItem>
            <SelectItem value="c">C Cup</SelectItem>
            <SelectItem value="d">D Cup</SelectItem>
            <SelectItem value="dd">DD Cup</SelectItem>
            <SelectItem value="ddd">DDD Cup</SelectItem>
            <SelectItem value="e">E Cup</SelectItem>
            <SelectItem value="f">F Cup</SelectItem>
            <SelectItem value="g">G Cup</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}