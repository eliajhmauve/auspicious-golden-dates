import { X, Sparkles, Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuspiciousDate, LuckLevel } from '@/lib/lunarCalendar';
import { getAuspiciousHours } from '@/lib/lunarCalendar';
import { useMemo } from 'react';

const LUCK_CONFIG: Record<LuckLevel, { label: string; cls: string; glow: string; rowCls: string }> = {
  '大吉': { label: '大吉', cls: 'bg-gold text-void font-bold', glow: 'shadow-[0_0_12px_rgba(212,168,67,0.5)]',     rowCls: 'border-gold/30 bg-gold/8' },
  '吉':   { label: '吉',   cls: 'bg-jade/20 text-jade border border-jade/40', glow: '',                             rowCls: 'border-jade/20 bg-jade/5' },
  '平':   { label: '平',   cls: 'bg-white/5 text-white/50 border border-white/10', glow: '',                       rowCls: 'border-white/5 bg-transparent' },
  '凶':   { label: '凶',   cls: 'bg-crimson/20 text-crimson border border-crimson/30', glow: '',                   rowCls: 'border-crimson/15 bg-crimson/5' },
};

interface Props {
  date: AuspiciousDate | null;
  onClose: () => void;
}

export function DateDetailDrawer({ date: d, onClose }: Props) {
  const isOpen = !!d;
  const hours = useMemo(() => d ? getAuspiciousHours(d.date) : [], [d]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />

      {/* Drawer panel */}
      <div
        className={cn(
          'fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ease-out',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{ fontFamily: "'Noto Serif TC', 'Georgia', serif" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-gold/30" />
        </div>

        <div className="glass-card rounded-t-3xl border-t border-gold/20 max-h-[85vh] overflow-y-auto pb-safe">
          {d && (
            <div className="px-5 pt-4 pb-8">

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gold/60 hover:text-gold transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title row */}
              <div className="pr-8 mb-5">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl font-bold text-gold leading-none">
                    {d.date.getDate()}
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm text-[hsl(40,30%,65%)]">{d.solarStr}</span>
                    <span className="text-xs text-[hsl(40,20%,50%)]">{d.lunarStr}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('text-xs px-2.5 py-0.5 rounded-full', LUCK_CONFIG[d.luckLevel].cls, LUCK_CONFIG[d.luckLevel].glow)}>
                    {d.luckLevel}
                  </span>
                  <span className="text-xs text-[hsl(40,20%,55%)]">{d.weekday}</span>
                </div>
              </div>

              <div className="w-full h-px bg-gold/10 mb-5" />

              {/* 天干地支 Breakdown */}
              <section className="mb-5">
                <h3 className="text-[10px] tracking-[0.2em] text-gold/60 uppercase mb-3">天干地支 · Stem-Branch</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '年', value: d.yearStemBranch, sub: `生肖：${d.zodiac}` },
                    { label: '月', value: d.monthStemBranch, sub: '' },
                    { label: '日', value: d.stemBranch, sub: '' },
                  ].map(({ label, value, sub }) => (
                    <div key={label} className="glass-card rounded-xl p-3 text-center border border-gold/10">
                      <div className="text-[10px] text-[hsl(40,20%,50%)] mb-1">{label}</div>
                      <div className="text-gold font-bold text-base leading-tight">{value}</div>
                      {sub && <div className="text-[10px] text-[hsl(40,20%,45%)] mt-1">{sub}</div>}
                    </div>
                  ))}
                </div>
              </section>

              {/* 時辰 Auspicious Hours */}
              <section className="mb-5">
                <h3 className="text-[10px] tracking-[0.2em] text-gold/60 uppercase mb-3 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-gold/60" /> 時辰吉凶 · Auspicious Hours
                </h3>

                {/* Legend */}
                <div className="flex gap-3 mb-3 flex-wrap">
                  {(['大吉', '吉', '平', '凶'] as LuckLevel[]).map(l => (
                    <div key={l} className="flex items-center gap-1">
                      <span className={cn('text-[10px] px-1.5 py-px rounded-full', LUCK_CONFIG[l].cls)}>
                        {LUCK_CONFIG[l].label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {hours.map((h) => (
                    <div
                      key={h.branch}
                      className={cn(
                        'flex items-center gap-2.5 rounded-xl px-3 py-2 border transition-all',
                        LUCK_CONFIG[h.luckLevel].rowCls,
                        h.luckLevel === '大吉' && 'shadow-[0_0_8px_rgba(212,168,67,0.12)]'
                      )}
                    >
                      {/* Hour name */}
                      <div className="flex flex-col items-center min-w-[28px]">
                        <span className={cn(
                          'text-sm font-bold leading-tight',
                          h.luckLevel === '大吉' ? 'text-gold' :
                          h.luckLevel === '吉' ? 'text-jade' :
                          h.luckLevel === '凶' ? 'text-crimson' :
                          'text-[hsl(40,15%,55%)]'
                        )}>
                          {h.branch}
                        </span>
                        <span className="text-[9px] text-[hsl(40,15%,40%)] leading-none mt-0.5">時</span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-mono text-[hsl(40,25%,55%)]">{h.stemBranch}</span>
                          <span className={cn('text-[9px] px-1.5 py-px rounded-full ml-auto shrink-0', LUCK_CONFIG[h.luckLevel].cls)}>
                            {h.luckLevel}
                          </span>
                        </div>
                        <div className="text-[9px] text-[hsl(40,15%,40%)] leading-none">
                          {h.timeRange}
                          {h.shen && <span className="ml-1 text-[hsl(40,25%,48%)]">· {h.shen}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 宜 Yi */}
              <section className="mb-5">
                <h3 className="text-[10px] tracking-[0.2em] text-jade/70 uppercase mb-3 flex items-center gap-1.5">
                  <span className="text-jade font-bold text-sm">宜</span> 宜做事項
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {d.yi.map(item => (
                    <span
                      key={item}
                      className="text-xs px-2.5 py-1 rounded-lg bg-jade/10 text-jade/90 border border-jade/20"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>

              {/* 忌 Ji */}
              <section className="mb-5">
                <h3 className="text-[10px] tracking-[0.2em] text-crimson/70 uppercase mb-3 flex items-center gap-1.5">
                  <span className="text-crimson font-bold text-sm">忌</span> 忌做事項
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {d.ji.map(item => (
                    <span
                      key={item}
                      className="text-xs px-2.5 py-1 rounded-lg bg-crimson/10 text-crimson/80 border border-crimson/20"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>

              {/* Special Notes */}
              {d.specialNotes.length > 0 && (
                <section>
                  <h3 className="text-[10px] tracking-[0.2em] text-gold/60 uppercase mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-gold/60" /> 特別提示
                  </h3>
                  <div className="space-y-2">
                    {d.specialNotes.map((note, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 glass-card rounded-xl px-3 py-2.5 border border-gold/10"
                      >
                        <Star className="w-3 h-3 text-gold/50 mt-0.5 shrink-0" />
                        <span className="text-xs text-[hsl(40,25%,60%)] leading-relaxed">{note}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
}
