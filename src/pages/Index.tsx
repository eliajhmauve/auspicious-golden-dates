import { useNavigate } from 'react-router-dom';
import { StarfieldBg } from '@/components/auspicious/StarfieldBg';
import { CalendarDays, BookOpen, Star, ChevronRight, Sparkles } from 'lucide-react';

const TOOLS = [
  {
    id: 'auspicious',
    href: '/auspicious',
    icon: CalendarDays,
    zhTitle: '擇日工具',
    enTitle: 'Auspicious Date Picker',
    desc: '依事由挑選黃道吉日，結合農曆宜忌、天干地支與時辰吉凶，輕鬆找到最適合的日期。',
    badge: '已上線',
    badgeColor: 'text-jade border-jade/40 bg-jade/10',
    glow: 'hover:shadow-[0_0_32px_rgba(67,190,120,0.15)]',
    accent: 'from-jade/20 to-jade/5',
    iconColor: 'text-jade',
  },
  {
    id: 'bazi',
    href: '#',
    icon: BookOpen,
    zhTitle: '生辰八字',
    enTitle: 'BaZi Calculator',
    desc: '輸入出生年月日時，推算八字四柱、五行格局，了解個人命理基礎。',
    badge: '即將推出',
    badgeColor: 'text-gold border-gold/30 bg-gold/10',
    glow: 'hover:shadow-[0_0_32px_rgba(212,168,67,0.15)]',
    accent: 'from-gold/20 to-gold/5',
    iconColor: 'text-gold',
  },
  {
    id: 'xingming',
    href: '#',
    icon: Star,
    zhTitle: '姓名學分析',
    enTitle: 'Name Analysis',
    desc: '依筆畫數、五行屬性與三才五格，分析姓名對運勢的影響，輔助命名決策。',
    badge: '即將推出',
    badgeColor: 'text-gold border-gold/30 bg-gold/10',
    glow: 'hover:shadow-[0_0_32px_rgba(212,168,67,0.15)]',
    accent: 'from-gold/15 to-gold/5',
    iconColor: 'text-gold',
  },
];

const FEATURES = [
  { icon: '🗓', label: '農曆換算', desc: '精確農曆公曆對照' },
  { icon: '⏱', label: '時辰吉凶', desc: '十二時辰逐時推算' },
  { icon: '🧭', label: '天干地支', desc: '年月日時四柱完整' },
  { icon: '📤', label: '一鍵分享', desc: '匯出精美吉日圖卡' },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen overflow-x-hidden starfield-bg"
      style={{ fontFamily: "'Noto Serif TC', 'Georgia', serif" }}
    >
      <StarfieldBg />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4 pb-20">

        {/* ── Hero ── */}
        <header className="flex flex-col items-center text-center pt-16 pb-10 max-w-sm">
          {/* Emblem */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center gold-glow-shadow">
              <span className="text-4xl leading-none">☰</span>
            </div>
            {/* Orbiting sparkle */}
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-gold animate-pulse" />
          </div>

          <p className="text-[10px] tracking-[0.35em] text-gold/60 uppercase mb-2">
            福青施老師 · 命理工具箱
          </p>
          <h1 className="text-3xl font-bold text-gold leading-tight mb-3">
            擇日·八字·姓名
          </h1>
          <p className="text-sm text-[hsl(40,20%,60%)] leading-relaxed">
            結合傳統命理智慧與現代技術，<br />
            為您的人生大事提供精準指引。
          </p>

          {/* CTA */}
          <button
            onClick={() => navigate('/auspicious')}
            className="mt-6 gold-btn px-6 py-2.5 rounded-full text-sm flex items-center gap-2 transition-all duration-200"
          >
            <CalendarDays className="w-4 h-4" />
            立即擇日
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </header>

        {/* ── Feature chips ── */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-sm mb-10">
          {FEATURES.map(f => (
            <div
              key={f.label}
              className="glass-card rounded-2xl px-3 py-3 flex items-center gap-2.5"
            >
              <span className="text-xl leading-none">{f.icon}</span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gold/90 leading-tight">{f.label}</div>
                <div className="text-[10px] text-[hsl(40,15%,50%)] leading-tight mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3 w-full max-w-sm mb-6">
          <div className="flex-1 h-px bg-gold/15" />
          <span className="text-[10px] tracking-[0.25em] text-gold/40">工具列表</span>
          <div className="flex-1 h-px bg-gold/15" />
        </div>

        {/* ── Tool cards ── */}
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {TOOLS.map(tool => {
            const Icon = tool.icon;
            const isLive = tool.badge === '已上線';
            return (
              <button
                key={tool.id}
                onClick={() => isLive && navigate(tool.href)}
                disabled={!isLive}
                className={[
                  'glass-card rounded-2xl p-4 text-left transition-all duration-200',
                  'border border-gold/15 group',
                  isLive
                    ? `cursor-pointer glass-card-hover ${tool.glow} active:scale-[0.98]`
                    : 'opacity-60 cursor-not-allowed',
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  {/* Icon bubble */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.accent} border border-white/10 flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-base font-bold text-gold/90 leading-tight">
                        {tool.zhTitle}
                      </span>
                      <span className={`text-[9px] px-1.5 py-px rounded-full border ${tool.badgeColor} leading-tight shrink-0`}>
                        {tool.badge}
                      </span>
                    </div>
                    <div className="text-[10px] text-[hsl(40,20%,50%)] mb-2 leading-tight">
                      {tool.enTitle}
                    </div>
                    <p className="text-xs text-[hsl(40,15%,55%)] leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>

                  {isLive && (
                    <ChevronRight className="w-4 h-4 text-gold/30 group-hover:text-gold/70 transition-colors shrink-0 mt-1" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── About section ── */}
        <div className="w-full max-w-sm mt-10">
          <div className="glass-card rounded-2xl p-5 border border-gold/15">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center shrink-0">
                <span className="text-xl leading-none">🧿</span>
              </div>
              <div>
                <div className="text-sm font-bold text-gold/90">福青施老師</div>
                <div className="text-[10px] text-[hsl(40,20%,50%)]">命理顧問 · 擇日師</div>
              </div>
            </div>
            <p className="text-xs text-[hsl(40,18%,58%)] leading-relaxed">
              深耕傳統命理三十餘年，融合八字、擇日、姓名學等多元學術，
              以科學化方式呈現古典命理精髓，協助客戶在婚嫁、開業、
              安床等人生要事上做出有據可依的選擇。
            </p>
            <div className="mt-3 pt-3 border-t border-gold/10 flex gap-3">
              {['婚嫁擇日', '開市吉日', '入宅安床', '生辰八字'].map(tag => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-gold/8 text-gold/60 border border-gold/15"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="mt-10 text-center">
          <div className="w-8 h-px bg-gold/20 mx-auto mb-3" />
          <p className="text-[10px] text-[hsl(40,15%,35%)] tracking-widest">
            © 福青施老師命理工作室
          </p>
          <p className="text-[10px] text-[hsl(40,15%,28%)] mt-1">
            本工具僅供參考，不構成任何承諾
          </p>
        </footer>
      </div>
    </div>
  );
}
