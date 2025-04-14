'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModelFilters } from '@/lib/api/types';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/contexts/LanguageContext';

interface TopFiltersProps {
  filters: ModelFilters;
  onChange: (filters: ModelFilters) => void;
}

const cupSizes = [
  { value: 'a', label: 'cup_a' },
  { value: 'b', label: 'cup_b' },
  { value: 'c', label: 'cup_c' },
  { value: 'd', label: 'cup_d' },
  { value: 'dd', label: 'cup_dd' },
  { value: 'ddd', label: 'cup_ddd' },
  { value: 'e', label: 'cup_e' },
  { value: 'f', label: 'cup_f' },
  { value: 'g', label: 'cup_g' }
];

export function TopFilters({ filters, onChange }: TopFiltersProps) {
  const { t } = useLanguage();
  const [selectedCupSize, setSelectedCupSize] = useState(filters.cup_size || 'any');

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
        <Label>{t('topfilters.hair_color')}</Label>
        <Select 
          value={filters.hair_color || 'any'}
          onValueChange={value => updateFilter('hair_color', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('topfilters.select_hair_color')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t('topfilters.any')}</SelectItem>
            <SelectItem value="blonde">{t('topfilters.blonde')}</SelectItem>
            <SelectItem value="brown">{t('topfilters.brown')}</SelectItem>
            <SelectItem value="black">{t('topfilters.black')}</SelectItem>
            <SelectItem value="red">{t('topfilters.red')}</SelectItem>
            <SelectItem value="auburn">{t('topfilters.auburn')}</SelectItem>
            <SelectItem value="grey">{t('topfilters.grey')}</SelectItem>
            <SelectItem value="other">{t('topfilters.other')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t('topfilters.eye_color')}</Label>
        <Select 
          value={filters.eye_color || 'any'}
          onValueChange={value => updateFilter('eye_color', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('topfilters.select_eye_color')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t('topfilters.any')}</SelectItem>
            <SelectItem value="blue">{t('topfilters.blue')}</SelectItem>
            <SelectItem value="green">{t('topfilters.green')}</SelectItem>
            <SelectItem value="brown">{t('topfilters.brown')}</SelectItem>
            <SelectItem value="hazel">{t('topfilters.hazel')}</SelectItem>
            <SelectItem value="grey">{t('topfilters.grey')}</SelectItem>
            <SelectItem value="amber">{t('topfilters.amber')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t('topfilters.cup_size')}</Label>
        <Select 
          value={filters.cup_size || 'any'}
          onValueChange={value => updateFilter('cup_size', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('topfilters.select_cup_size')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t('topfilters.any')}</SelectItem>
            {cupSizes.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {t(`topfilters.${label}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}