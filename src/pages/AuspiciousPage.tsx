import { useState } from 'react';
import { StarfieldBg } from '@/components/auspicious/StarfieldBg';
import { EventTypeGrid, type EventType } from '@/components/auspicious/EventTypeGrid';
import { DateCard } from '@/components/auspicious/DateCard';
import { CalendarView } from '@/components/auspicious/CalendarView';
import { DateDetailDrawer } from '@/components/auspicious/DateDetailDrawer';
import { getAuspiciousDates, type AuspiciousDate } from '@/lib/lunarCalendar';
import { Sparkles, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

const EVENT_LABELS: Record<string, string> = {
  wedding: '婚嫁', moving: '搬遷', business: '開業',
  vehicle: '提車', travel: '出行', construction: '動土',
  contract: '簽約', enrollment: '開學',
};

const now = new Date();

function getMonthOptions() {
  const opts = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    opts.push({
      value: `${d.getFullYear()}-${d.getMonth()}`,
      label: `${d.getFullYear()}年${d.getMonth() + 1}月`,
      date: d,
    });
  }
  return opts;
}

const MONTH_OPTS = getMonthOptions();

export default function AuspiciousPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState(2);
  const [results, setResults] = useState<AuspiciousDate[] | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarMonth, setCalendarMonth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [drawerDate, setDrawerDate] = useState<AuspiciousDate | null>(null);

  const handleSearch = () => {
    if (!selectedEvent) return;
    setLoading(true);
    setTimeout(() => {
      const start = MONTH_OPTS[startIdx].date;
      const end = MONTH_OPTS[endIdx].date;
      const r = getAuspiciousDates(selectedEvent, start, end);
      setResults(r);
      setCalendarMonth(startIdx);
      setLoading(false);
    }, 600);
  };

  const calResult = results
    ? results.filter(d =>
        d.date.getFullYear() === MONTH_OPTS[calendarMonth].date.getFullYear() &&
        d.date.getMonth() === MONTH_OPTS[calendarMonth].date.getMonth()
      )
    : [];

  return (
    <div
      className="relative min-h-screen starfield-bg overflow-x-hidden"
      style={{ fontFamily: "'Noto Serif TC', 'Georgia', serif" }}
    >
      <StarfieldBg />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[hsl(40,20%,50%)] mb-8">
          <span className="hover:text-gold cursor-pointer transition-colors">首頁</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gold">擇日工具</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-gold tracking-widest border-gold/30">
              <Sparkles className="w-3 h-3" />
              福青施老師 · 擇日服務
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gold tracking-wider mb-2">
            擇日工具
          </h1>
          <p className="text-sm sm:text-base text-[hsl(40,20%,55%)] tracking-wide">
            Auspicious Date Picker · 選吉避凶，萬事亨通
          </p>
          <div className="mt-4 w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto opacity-60" />
        </div>

        {/* Input Panel */}
        <div className="glass-card gold-glow-shadow rounded-3xl p-6 sm:p-8 mb-8">
          {/* Event type */}
          <div className="mb-6">
            <label className="block text-xs font-bold tracking-widest text-gold mb-3 uppercase">
              事件類型 · Event Type
            </label>
            <EventTypeGrid selected={selectedEvent} onSelect={setSelectedEvent} />
          </div>

          {/* Date range */}
          <div className="mb-7">
            <label className="block text-xs font-bold tracking-widest text-gold mb-3 uppercase">
              查詢月份範圍 · Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[10px] text-[hsl(40,20%,50%)] mb-1.5 tracking-wider">開始月份</span>
                <select
                  value={startIdx}
                  onChange={e => {
                    const v = Number(e.target.value);
                    setStartIdx(v);
                    if (v > endIdx) setEndIdx(v);
                  }}
                  className="w-full glass-card rounded-xl px-3 py-2.5 text-sm text-gold bg-transparent border border-gold/20 focus:border-gold/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  {MONTH_OPTS.map((o, i) => (
                    <option key={o.value} value={i} className="bg-[#0d0b1e] text-gold">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="block text-[10px] text-[hsl(40,20%,50%)] mb-1.5 tracking-wider">結束月份</span>
                <select
                  value={endIdx}
                  onChange={e => setEndIdx(Number(e.target.value))}
                  className="w-full glass-card rounded-xl px-3 py-2.5 text-sm text-gold bg-transparent border border-gold/20 focus:border-gold/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  {MONTH_OPTS.map((o, i) => (
                    <option key={o.value} value={i} disabled={i < startIdx} className="bg-[#0d0b1e] text-gold">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            disabled={!selectedEvent || loading}
            className={cn(
              'w-full py-3.5 rounded-xl text-sm font-bold tracking-[0.15em] transition-all duration-200',
              selectedEvent && !loading
                ? 'gold-btn hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-[hsl(40,10%,20%)] text-[hsl(40,10%,45%)] cursor-not-allowed'
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                正在排算吉日…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                查詢吉日
              </span>
            )}
          </button>
        </div>

        {/* Results */}
        {results !== null && (
          <div className="space-y-4">
            {/* Result header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-gold font-bold text-lg tracking-wider">
                  {selectedEvent && EVENT_LABELS[selectedEvent]} · 吉日清單
                </h2>
                <p className="text-xs text-[hsl(40,20%,50%)] mt-0.5">
                  {MONTH_OPTS[startIdx].label} — {MONTH_OPTS[endIdx].label} · 共 <span className="text-gold font-bold">{results.length}</span> 個吉日
                </p>
              </div>
              <div className="flex items-center gap-1 glass-card rounded-xl p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    viewMode === 'list' ? 'bg-gold/15 text-gold' : 'text-[hsl(40,20%,50%)] hover:text-gold'
                  )}
                >
                  <List className="w-3.5 h-3.5" /> 清單
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    viewMode === 'calendar' ? 'bg-gold/15 text-gold' : 'text-[hsl(40,20%,50%)] hover:text-gold'
                  )}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> 月曆
                </button>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center text-[hsl(40,20%,50%)]">
                此範圍內暫無吉日，請嘗試擴大月份範圍。
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                {results.map((d, i) => (
                  <DateCard key={i} d={d} onSelect={setDrawerDate} />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {Array.from({ length: endIdx - startIdx + 1 }, (_, i) => {
                  const idx = startIdx + i;
                  const mDate = MONTH_OPTS[idx].date;
                  const mResults = results.filter(d =>
                    d.date.getFullYear() === mDate.getFullYear() &&
                    d.date.getMonth() === mDate.getMonth()
                  );
                  return (
                    <CalendarView
                      key={idx}
                      dates={mResults}
                      month={mDate}
                      onPrev={() => {}}
                      onNext={() => {}}
                      onSelectDate={setDrawerDate}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto opacity-30 mb-4" />
          <p className="text-[10px] text-[hsl(40,15%,35%)] tracking-widest">
            © 福青施老師 · 擇日僅供參考，實際請諮詢老師
          </p>
        </div>
      </div>

      {/* Detail Drawer */}
      <DateDetailDrawer date={drawerDate} onClose={() => setDrawerDate(null)} />
    </div>
  );
}
