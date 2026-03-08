import { forwardRef } from 'react';
import type { AuspiciousDate, LuckLevel } from '@/lib/lunarCalendar';

const LUCK_BG: Record<LuckLevel, string> = {
  '大吉': '#D4A843',
  '吉':   '#4CAF82',
  '平':   '#666',
  '凶':   '#C0392B',
};
const LUCK_TEXT: Record<LuckLevel, string> = {
  '大吉': '#07060D',
  '吉':   '#07060D',
  '平':   '#fff',
  '凶':   '#fff',
};

const EVENT_LABELS: Record<string, string> = {
  wedding: '婚嫁', moving: '搬遷', business: '開業',
  vehicle: '提車', travel: '出行', construction: '動土',
  contract: '簽約', enrollment: '開學',
};
const EVENT_EMOJI: Record<string, string> = {
  wedding: '💒', moving: '🏠', business: '🏪',
  vehicle: '🚗', travel: '✈️', construction: '🏗️',
  contract: '📝', enrollment: '🎓',
};

interface Props {
  eventType: string;
  rangeLabel: string;
  dates: AuspiciousDate[];
}

/** Rendered off-screen; captured by html2canvas */
export const ShareCard = forwardRef<HTMLDivElement, Props>(
  ({ eventType, rangeLabel, dates }, ref) => {
    const topDates = [
      ...dates.filter(d => d.luckLevel === '大吉'),
      ...dates.filter(d => d.luckLevel === '吉'),
    ].slice(0, 8);

    return (
      <div
        ref={ref}
        style={{
          width: 640,
          background: 'linear-gradient(160deg, #0d0b1e 0%, #111029 60%, #1a1030 100%)',
          fontFamily: "'Noto Serif TC', Georgia, serif",
          padding: '40px 36px 32px',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background circle */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(212,168,67,0.6)', letterSpacing: '0.2em', marginBottom: 6 }}>
              福青施老師 · 擇日服務
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 28 }}>{EVENT_EMOJI[eventType] ?? '📅'}</span>
              <div>
                <div style={{ fontSize: 26, fontWeight: 'bold', color: '#D4A843', lineHeight: 1.1 }}>
                  {EVENT_LABELS[eventType] ?? eventType} 吉日
                </div>
                <div style={{ fontSize: 11, color: 'rgba(212,168,67,0.5)', marginTop: 3 }}>{rangeLabel}</div>
              </div>
            </div>
          </div>
          <div style={{
            background: 'rgba(212,168,67,0.12)',
            border: '1px solid rgba(212,168,67,0.25)',
            borderRadius: 12, padding: '6px 14px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#D4A843', lineHeight: 1 }}>{dates.length}</div>
            <div style={{ fontSize: 10, color: 'rgba(212,168,67,0.55)', marginTop: 2 }}>個吉日</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.3), transparent)', marginBottom: 22 }} />

        {/* Date list */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {topDates.map((d, i) => (
            <div
              key={i}
              style={{
                background: d.luckLevel === '大吉'
                  ? 'rgba(212,168,67,0.07)'
                  : 'rgba(255,255,255,0.03)',
                border: d.luckLevel === '大吉'
                  ? '1px solid rgba(212,168,67,0.3)'
                  : '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: '10px 12px',
                display: 'flex',
                gap: 10,
                alignItems: 'center',
              }}
            >
              {/* Day number */}
              <div style={{ textAlign: 'center', minWidth: 36 }}>
                <div style={{ fontSize: 22, fontWeight: 'bold', color: '#D4A843', lineHeight: 1 }}>
                  {d.date.getDate()}
                </div>
                <div style={{ fontSize: 9, color: 'rgba(212,168,67,0.5)', marginTop: 1 }}>
                  {d.date.getMonth() + 1}月
                </div>
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 'bold', padding: '1px 6px', borderRadius: 20,
                    background: LUCK_BG[d.luckLevel], color: LUCK_TEXT[d.luckLevel],
                  }}>
                    {d.luckLevel}
                  </span>
                  <span style={{ fontSize: 10, color: 'rgba(212,168,67,0.5)' }}>{d.weekday}</span>
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>
                  {d.lunarStr} · {d.stemBranch}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(100,200,140,0.8)' }}>
                  宜：{d.yi.slice(0, 3).join('、')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ height: 1, flex: 1, background: 'rgba(212,168,67,0.12)' }} />
          <div style={{ margin: '0 14px', fontSize: 10, color: 'rgba(212,168,67,0.35)', letterSpacing: '0.15em' }}>
            擇日僅供參考 · 實際請諮詢老師
          </div>
          <div style={{ height: 1, flex: 1, background: 'rgba(212,168,67,0.12)' }} />
        </div>
      </div>
    );
  }
);
ShareCard.displayName = 'ShareCard';
