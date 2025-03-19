'use client';

export interface RangeValue {
  min?: number;
  max?: number;
}

export function parseRangeString(value: string): RangeValue | undefined {
  // Handle "20-30" format
  if (value.includes('-')) {
    const [min, max] = value.split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      return { min, max };
    }
  }
  
  // Handle single number
  const num = Number(value);
  if (!isNaN(num)) {
    return { min: num, max: num };
  }

  return undefined;
}

export function formatRangeValue(value: RangeValue | undefined): string {
  if (!value) return '';
  
  if (value.min === value.max) {
    return value.min?.toString() || '';
  }
  
  return `${value.min || ''}-${value.max || ''}`;
}

export function validateRange(value: RangeValue): boolean {
  if (!value.min && !value.max) return false;
  if (value.min && value.max && value.min > value.max) return false;
  return true;
}