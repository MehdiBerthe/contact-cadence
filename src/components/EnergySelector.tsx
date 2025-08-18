import { EnergyLevel } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Zap, ZapOff, Flame } from 'lucide-react';

interface EnergySelectorProps {
  value: EnergyLevel;
  onChange: (energy: EnergyLevel) => void;
  className?: string;
}

const energyConfig = {
  low: {
    label: 'Low',
    icon: ZapOff,
    description: 'Quick check-in',
    className: 'energy-low'
  },
  medium: {
    label: 'Medium',
    icon: Zap,
    description: 'Share value',
    className: 'energy-medium'
  },
  high: {
    label: 'High',
    icon: Flame,
    description: 'Propose call',
    className: 'energy-high'
  }
};

export function EnergySelector({ value, onChange, className }: EnergySelectorProps) {
  return (
    <div className={cn('flex gap-1', className)}>
      {(Object.keys(energyConfig) as EnergyLevel[]).map((energy) => {
        const config = energyConfig[energy];
        const Icon = config.icon;
        const isSelected = value === energy;
        
        return (
          <Button
            key={energy}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(energy)}
            className={cn(
              'h-8 px-2 text-xs',
              isSelected && config.className
            )}
            title={config.description}
          >
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
          </Button>
        );
      })}
    </div>
  );
}