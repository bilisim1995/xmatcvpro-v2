'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ModelFilters } from '@/lib/api/types';
import { Separator } from '@/components/ui/separator';
import { RangeSlider } from './range-slider';

interface FiltersProps {
  filters: ModelFilters;
  onChange: (filters: ModelFilters) => void;
}

export function SideFilters({ filters, onChange }: FiltersProps) {
  const updateFilter = (key: keyof ModelFilters, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Physical Attributes */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Physical Attributes</h4>
        <div className="grid gap-6">
          <RangeSlider
            label="Age"
            value={typeof filters.age === 'string' ? 
              { min: parseInt(filters.age.split('-')[0]), max: parseInt(filters.age.split('-')[1]) } :
              filters.age ? { min: filters.age, max: filters.age } : undefined
            }
            onChange={(range) => updateFilter('age', range.min === range.max ? range.min : `${range.min}-${range.max}`)}
            min={18}
            max={50}
          />

          <RangeSlider
            label="Height"
            value={typeof filters.height === 'string' ?
              { min: parseInt(filters.height.split('-')[0]), max: parseInt(filters.height.split('-')[1]) } :
              filters.height ? { min: filters.height, max: filters.height } : undefined
            }
            onChange={(range) => updateFilter('height', range.min === range.max ? range.min : `${range.min}-${range.max}`)}
            min={150}
            max={190}
            step={5}
            unit="cm"
          />

          <RangeSlider
            label="Weight"
            value={typeof filters.weight === 'string' ?
              { min: parseInt(filters.weight.split('-')[0]), max: parseInt(filters.weight.split('-')[1]) } :
              filters.weight ? { min: filters.weight, max: filters.weight } : undefined
            }
            onChange={(range) => updateFilter('weight', range.min === range.max ? range.min : `${range.min}-${range.max}`)}
            min={40}
            max={100}
            step={5}
            unit="kg"
          />
        </div>
      </div>

      <Separator />

      {/* Appearance */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Appearance</h4>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Ethnicity</Label>
            <Select 
              value={filters.ethnicity} 
              onValueChange={value => updateFilter('ethnicity', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ethnicity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="caucasian">Caucasian</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="ebony">Ebony</SelectItem>
                <SelectItem value="latina">Latina</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="middle_eastern">Middle Eastern</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nationality</Label>
            <Select 
              value={filters.nationality} 
              onValueChange={value => updateFilter('nationality', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select nationality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="american">American</SelectItem>
                <SelectItem value="british">British</SelectItem>
                <SelectItem value="canadian">Canadian</SelectItem>
                <SelectItem value="australian">Australian</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="russian">Russian</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
                <SelectItem value="korean">Korean</SelectItem>
                <SelectItem value="brazilian">Brazilian</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Additional Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Additional Details</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Has Tattoos</Label>
            <Switch 
              checked={filters.tattoos === 'yes'}
              onCheckedChange={value => updateFilter('tattoos', value ? 'yes' : 'no')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Has Piercings</Label>
            <Switch 
              checked={filters.piercings === 'yes'}
              onCheckedChange={value => updateFilter('piercings', value ? 'yes' : 'no')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}