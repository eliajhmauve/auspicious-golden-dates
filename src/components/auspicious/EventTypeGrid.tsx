import { cn } from '@/lib/utils';

export type EventType = 'wedding' | 'moving' | 'business' | 'vehicle' | 'travel' | 'construction' | 'contract' | 'enrollment';

const EVENTS: { id: EventType; emoji: string; zh: string; en: string }[] = [
  { id: 'wedding',      emoji: '💒', zh: '婚嫁',  en: 'Wedding' },
  { id: 'moving',       emoji: '🏠', zh: '搬遷',  en: 'Moving' },
  { id: 'business',     emoji: '🏪', zh: '開業',  en: 'Business Opening' },
  { id: 'vehicle',      emoji: '🚗', zh: '提車',  en: 'Vehicle Pickup' },
  { id: 'travel',       emoji: '✈️', zh: '出行',  en: 'Travel' },
  { id: 'construction', emoji: '🏗️', zh: '動土',  en: 'Construction' },
  { id: 'contract',     emoji: '📝', zh: '簽約',  en: 'Contract' },
  { id: 'enrollment',   emoji: '🎓', zh: '開學',  en: 'Enrollment' },
];

interface EventTypeGridProps {
  selected: EventType | null;
  onSelect: (t: EventType) => void;
}

export function EventTypeGrid({ selected, onSelect }: EventTypeGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {EVENTS.map(ev => (
        <button
          key={ev.id}
          onClick={() => onSelect(ev.id)}
          className={cn(
            'group flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all duration-200',
            'glass-card glass-card-hover cursor-pointer',
            selected === ev.id
              ? 'border-gold shadow-[0_0_16px_rgba(212,168,67,0.35)] bg-[rgba(212,168,67,0.12)]'
              : 'opacity-75 hover:opacity-100'
          )}
        >
          <span className="text-2xl leading-none">{ev.emoji}</span>
          <span className={cn(
            'text-xs font-bold tracking-wide',
            selected === ev.id ? 'text-gold' : 'text-[hsl(40,40%,75%)]'
          )}>
            {ev.zh}
          </span>
          <span className={cn(
            'text-[9px] tracking-wider hidden sm:block',
            selected === ev.id ? 'text-gold-dim' : 'text-[hsl(40,20%,55%)]'
          )}>
            {ev.en}
          </span>
        </button>
      ))}
    </div>
  );
}

export { EVENTS };
