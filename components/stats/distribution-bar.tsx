'use client';

interface DistributionBarProps {
  percentage: number;
}

export function DistributionBar({ percentage }: DistributionBarProps) {
  return (
    <div className="h-2 bg-red-100 dark:bg-red-900/20 rounded-full overflow-hidden">
      <div
        className="h-full bg-red-600 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}