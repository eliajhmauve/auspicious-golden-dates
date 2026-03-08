import type { AuspiciousDate, LuckLevel } from '@/lib/lunarCalendar';
import { cn } from '@/lib/utils';

const LUCK_CONFIG: Record<LuckLevel, { label: string; cls: string; glow: string }> = {
  '大吉': { label: '大吉', cls: 'bg-gold text-void font-bold', glow: 'shadow-[0_0_12px_rgba(212,168,67,0.5)]' },
  '吉':   { label: '吉',   cls: 'bg-jade/20 text-jade border border-jade/40', glow: '' },
  '平':   { label: '平',   cls: 'bg-white/5 text-white/50 border border-white/10', glow: '' },
  '凶':   { label: '凶',   cls: 'bg-crimson/20 text-crimson border border-crimson/30', glow: '' },
};

export function DateCard({ d, onSelect }: { d: AuspiciousDate; onSelect?: (d: AuspiciousDate) => void }) {
  const luck = LUCK_CONFIG[d.luckLevel];

  return (
    <div
      onClick={() => onSelect?.(d)}
      className={cn(
        'glass-card glass-card-hover rounded-2xl p-4 sm:p-5 transition-all duration-300',
        onSelect && 'cursor-pointer active:scale-[0.99]',
        d.luckLevel === '大吉' && 'border-gold/40 shadow-[0_0_24px_rgba(212,168,67,0.1)]'
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        {/* Date block */}
        <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:min-w-[88px] sm:text-center">
          <div className="flex flex-col leading-tight">
            <span className="text-2xl sm:text-3xl font-bold text-gold tracking-tight">
              {d.date.getDate()}
            </span>
            <span className="text-xs text-[hsl(40,30%,60%)]">
              {d.date.getFullYear()}.{String(d.date.getMonth() + 1).padStart(2, '0')}
            </span>
          </div>
          <div className="sm:hidden flex gap-2 items-center">
            <span className="text-xs text-[hsl(40,20%,60%)]">{d.weekday}</span>
            <span className="text-xs text-[hsl(40,20%,50%)]">{d.stemBranch}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px self-stretch bg-gold/15 mx-1" />

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={cn('text-xs px-2.5 py-0.5 rounded-full', luck.cls, luck.glow)}>
              {luck.label}
            </span>
            <span className="text-xs text-[hsl(40,25%,55%)] hidden sm:inline">{d.weekday}</span>
            <span className="text-xs text-[hsl(40,30%,50%)] font-mono hidden sm:inline">{d.stemBranch}</span>
            <span className="text-xs text-[hsl(40,20%,50%)] ml-auto">{d.lunarStr}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* 宜 */}
            <div className="flex gap-2">
              <span className="text-jade font-bold text-sm shrink-0 mt-0.5">宜</span>
              <div className="flex flex-wrap gap-1">
                {d.yi.slice(0, 4).map(item => (
                  <span key={item} className="text-xs px-2 py-0.5 rounded-md bg-jade/10 text-jade/90 border border-jade/20">
                    {item}
                  </span>
                ))}
                {d.yi.length > 4 && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-jade/5 text-jade/50 border border-jade/10">
                    +{d.yi.length - 4}
                  </span>
                )}
              </div>
            </div>
            {/* 忌 */}
            <div className="flex gap-2">
              <span className="text-crimson font-bold text-sm shrink-0 mt-0.5">忌</span>
              <div className="flex flex-wrap gap-1">
                {d.ji.slice(0, 3).map(item => (
                  <span key={item} className="text-xs px-2 py-0.5 rounded-md bg-crimson/10 text-crimson/80 border border-crimson/20">
                    {item}
                  </span>
                ))}
                {d.ji.length > 3 && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-crimson/5 text-crimson/50 border border-crimson/10">
                    +{d.ji.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tap hint on mobile */}
          {onSelect && (
            <p className="text-[10px] text-[hsl(40,15%,40%)] mt-2 sm:hidden">點擊查看完整詳情 →</p>
          )}
        </div>
      </div>
    </div>
  );
}
