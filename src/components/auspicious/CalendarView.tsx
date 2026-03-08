import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuspiciousDate } from '@/lib/lunarCalendar';
import { getLunarDate } from '@/lib/lunarCalendar';

interface CalendarViewProps {
  dates: AuspiciousDate[];
  month: Date;
  onPrev: () => void;
  onNext: () => void;
}

const WEEKDAY_HEADERS = ['日', '一', '二', '三', '四', '五', '六'];
const MONTH_NAMES = ['一月', '二月', '三月', '四月', '五月', '六月',
                     '七月', '八月', '九月', '十月', '十一月', '十二月'];

export function CalendarView({ dates, month, onPrev, onNext }: CalendarViewProps) {
  const auspSet = new Set(
    dates.map(d => `${d.date.getFullYear()}-${d.date.getMonth()}-${d.date.getDate()}`)
  );
  const bigJiSet = new Set(
    dates.filter(d => d.luckLevel === '大吉').map(d => `${d.date.getFullYear()}-${d.date.getMonth()}-${d.date.getDate()}`)
  );

  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrev} className="p-1.5 rounded-lg hover:bg-gold/10 text-gold transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-gold font-bold tracking-widest text-sm">
          {year} · {MONTH_NAMES[m]}
        </span>
        <button onClick={onNext} className="p-1.5 rounded-lg hover:bg-gold/10 text-gold transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_HEADERS.map(h => (
          <div key={h} className="text-center text-[10px] text-[hsl(40,20%,50%)] py-1 font-medium">
            {h}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const key = `${year}-${m}-${day}`;
          const isAusp = auspSet.has(key);
          const isBig = bigJiSet.has(key);
          const lunar = getLunarDate(new Date(year, m, day));
          return (
            <div
              key={i}
              className={cn(
                'relative flex flex-col items-center justify-center rounded-lg py-1.5 transition-all duration-150',
                isAusp
                  ? isBig
                    ? 'bg-gold/15 border border-gold/40'
                    : 'bg-jade/10 border border-jade/25'
                  : 'hover:bg-white/3'
              )}
            >
              <span className={cn(
                'text-xs font-semibold',
                isBig ? 'text-gold' : isAusp ? 'text-jade' : 'text-[hsl(40,15%,65%)]'
              )}>
                {day}
              </span>
              <span className="text-[8px] text-[hsl(40,15%,45%)] leading-none mt-0.5">
                {lunar.lunarDayStr.replace('初', '').replace('十', '十').slice(0, 2)}
              </span>
              {isBig && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_4px_rgba(212,168,67,0.8)]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 pt-3 border-t border-gold/10 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gold" />
          <span className="text-[10px] text-[hsl(40,20%,55%)]">大吉</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-jade" />
          <span className="text-[10px] text-[hsl(40,20%,55%)]">吉</span>
        </div>
      </div>
    </div>
  );
}
