import { BarChart3, Megaphone, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsModal } from '@/components/stats/stats-modal';
import { AdModal } from '@/components/advertising/ad-modal';
import { ApiModal } from '@/components/api/api-modal';
import { Separator } from '@/components/ui/separator';

export function ActionButtons() {
  return (
    <div className="flex items-center gap-2">
      <ApiModal />
      <Separator orientation="vertical" className="h-5" />
      <StatsModal trigger={
        <Button variant="ghost" size="icon" className="hover:text-red-600 transition-colors">
          <BarChart3 className="h-5 w-5" />
        </Button>
      } />
      <Separator orientation="vertical" className="h-5" />
      <AdModal trigger={
        <Button variant="ghost" size="icon" className="hover:text-red-600 transition-colors">
          <Megaphone className="h-5 w-5" />
        </Button>
      } />
    </div>
  );
}