import { ContactSegment } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface SegmentBadgeProps {
  segment: ContactSegment;
  className?: string;
}

const segmentConfig = {
  TOP5: {
    label: 'Top 5',
    description: '3-day cadence',
    className: 'segment-top5'
  },
  WEEKLY15: {
    label: 'Weekly 15',
    description: '7-day cadence',
    className: 'segment-weekly15'
  },
  MONTHLY100: {
    label: 'Monthly 100',
    description: '30-day cadence',
    className: 'segment-monthly100'
  }
};

export function SegmentBadge({ segment, className }: SegmentBadgeProps) {
  const config = segmentConfig[segment];
  
  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
      title={config.description}
    >
      {config.label}
    </span>
  );
}