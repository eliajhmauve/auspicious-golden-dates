// Simplified Lunar Calendar utility for auspicious date calculation

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZODIAC = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];

const LUNAR_MONTHS = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '臘'];
const LUNAR_DAYS = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];

const WEEKDAYS_ZH = ['日', '一', '二', '三', '四', '五', '六'];

// Simplified lunar date lookup table (month offsets for 2024-2026)
// These are approximate; a real implementation would use full algorithm
const LUNAR_MONTH_DATA: Record<string, { lunarMonth: number; lunarDay: number; isLeap: boolean }> = {};

function buildLunarData() {
  // Approximate solar-to-lunar mapping for 2025-2026
  // Starting reference: 2025-01-29 = 正月初一
  const lunarStart2025 = new Date(2025, 0, 29); // Jan 29, 2025 = 正月初一
  const lunarStart2026 = new Date(2026, 1, 17);  // Feb 17, 2026 = 正月初一

  // Approximate lunar month lengths for 2025 (30,29,30,29,30,30,29,30,29,30,29,30)
  const monthLengths2025 = [30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30];
  const monthLengths2026 = [30, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30, 29];

  let current = new Date(2025, 0, 29);
  let lunarMonth = 1;
  let lunarDay = 1;
  let daysInMonth = monthLengths2025[0];
  let yearRef = 2025;

  for (let i = 0; i < 730; i++) {
    const key = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}`;
    LUNAR_MONTH_DATA[key] = { lunarMonth, lunarDay, isLeap: false };
    lunarDay++;
    if (lunarDay > daysInMonth) {
      lunarDay = 1;
      lunarMonth++;
      if (lunarMonth > 12) {
        lunarMonth = 1;
        yearRef++;
      }
      const lengths = yearRef === 2025 ? monthLengths2025 : monthLengths2026;
      daysInMonth = lengths[(lunarMonth - 1) % 12] || 30;
    }
    current = new Date(current.getTime() + 86400000);
  }
}

buildLunarData();

export function getLunarDate(date: Date): { lunarMonth: number; lunarDay: number; lunarMonthStr: string; lunarDayStr: string } {
  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const data = LUNAR_MONTH_DATA[key];
  if (data) {
    return {
      lunarMonth: data.lunarMonth,
      lunarDay: data.lunarDay,
      lunarMonthStr: LUNAR_MONTHS[(data.lunarMonth - 1) % 12] + '月',
      lunarDayStr: LUNAR_DAYS[data.lunarDay - 1] || `${data.lunarDay}日`,
    };
  }
  // Fallback approximation
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 86400000);
  const lMonth = ((Math.floor(dayOfYear / 30) + 1) % 12) + 1;
  const lDay = (dayOfYear % 30) + 1;
  return {
    lunarMonth: lMonth,
    lunarDay: lDay,
    lunarMonthStr: LUNAR_MONTHS[(lMonth - 1) % 12] + '月',
    lunarDayStr: LUNAR_DAYS[(lDay - 1) % 30],
  };
}

export function getStemBranch(date: Date): { stem: string; branch: string; dayName: string } {
  // Reference: Jan 1, 2000 = 甲子 day (day 0 of 60-cycle)
  // Actually Jan 1 2000 was Jiachen year, 丁卯 month, 甲子 day -> stem=甲(0), branch=子(0)
  const ref = new Date(2000, 0, 1);
  const days = Math.floor((date.getTime() - ref.getTime()) / 86400000);
  const cycle = ((days % 60) + 60) % 60;
  const stemIdx = cycle % 10;
  const branchIdx = cycle % 12;
  return {
    stem: HEAVENLY_STEMS[stemIdx],
    branch: EARTHLY_BRANCHES[branchIdx],
    dayName: HEAVENLY_STEMS[stemIdx] + EARTHLY_BRANCHES[branchIdx],
  };
}

export function getWeekdayZh(date: Date): string {
  return '週' + WEEKDAYS_ZH[date.getDay()];
}

// Auspicious activities per event type
const EVENT_ACTIVITIES: Record<string, { yi: string[]; ji: string[] }> = {
  wedding: {
    yi: ['嫁娶', '祈福', '納采', '合帳', '安床', '入宅', '宴客'],
    ji: ['出行', '動土', '破土', '開渠', '安葬'],
  },
  moving: {
    yi: ['移徙', '入宅', '安床', '祈福', '掛匾', '安香'],
    ji: ['嫁娶', '開市', '安葬', '破土'],
  },
  business: {
    yi: ['開市', '開業', '入宅', '祈福', '掛匾', '納財', '求財'],
    ji: ['安葬', '破土', '移徙'],
  },
  vehicle: {
    yi: ['出行', '納車', '祈福', '安機械'],
    ji: ['嫁娶', '安葬', '破土'],
  },
  travel: {
    yi: ['出行', '祈福', '求醫', '赴任'],
    ji: ['嫁娶', '安葬', '破土', '動土'],
  },
  construction: {
    yi: ['動土', '破土', '修造', '豎柱', '上樑', '開渠'],
    ji: ['嫁娶', '開市', '安葬'],
  },
  contract: {
    yi: ['訂盟', '簽約', '交易', '納財', '開市'],
    ji: ['安葬', '破土', '出行'],
  },
  enrollment: {
    yi: ['入學', '祈福', '習藝', '開光', '開業'],
    ji: ['安葬', '破土', '嫁娶'],
  },
};

// Luck level: 大吉, 吉, 平, 凶 
const LUCK_LEVELS = ['大吉', '吉', '吉', '平', '平', '平', '凶'] as const;
export type LuckLevel = '大吉' | '吉' | '平' | '凶';

// Auspicious branch days for event types (simplified traditional rules)
const AUSPICIOUS_BRANCHES: Record<string, number[]> = {
  wedding: [2, 5, 6, 10],    // 寅午未亥
  moving: [2, 5, 3, 9],      // 寅午卯酉
  business: [1, 5, 9, 3],    // 丑午酉卯
  vehicle: [0, 4, 8, 3],     // 子辰申卯
  travel: [2, 6, 10, 4],     // 寅未亥辰
  construction: [2, 5, 9, 1],
  contract: [1, 5, 3, 9],
  enrollment: [2, 3, 6, 10],
};

export interface AuspiciousDate {
  date: Date;
  solarStr: string;
  lunarStr: string;
  weekday: string;
  stemBranch: string;
  luckLevel: LuckLevel;
  yi: string[];
  ji: string[];
}

export function getAuspiciousDates(
  eventType: string,
  startDate: Date,
  endDate: Date
): AuspiciousDate[] {
  const results: AuspiciousDate[] = [];
  const activities = EVENT_ACTIVITIES[eventType] || EVENT_ACTIVITIES.wedding;
  const auspBranches = AUSPICIOUS_BRANCHES[eventType] || AUSPICIOUS_BRANCHES.wedding;

  const current = new Date(startDate);
  current.setDate(1);
  endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);

  while (current <= endDate) {
    const sb = getStemBranch(current);
    const branchIdx = EARTHLY_BRANCHES.indexOf(sb.branch);
    const stemIdx = HEAVENLY_STEMS.indexOf(sb.stem);

    // Determine luck level
    let luckLevel: LuckLevel = '平';
    const isAuspBranch = auspBranches.includes(branchIdx);
    const isGoodStem = [0, 2, 4, 6, 8].includes(stemIdx); // Yang stems

    if (isAuspBranch && isGoodStem) {
      luckLevel = Math.random() > 0.4 ? '大吉' : '吉';
    } else if (isAuspBranch || isGoodStem) {
      luckLevel = '吉';
    } else if (stemIdx % 5 === 4) {
      luckLevel = '凶';
    }

    // Only include 大吉 and 吉 days
    if (luckLevel === '大吉' || luckLevel === '吉') {
      const lunar = getLunarDate(current);

      // Pick subset of yi/ji based on day
      const yiCount = 3 + (stemIdx % 3);
      const jiCount = 2 + (branchIdx % 2);
      const shuffledYi = [...activities.yi].sort(() => (stemIdx + branchIdx) % 2 === 0 ? 1 : -1);
      const shuffledJi = [...activities.ji].sort(() => (stemIdx + branchIdx) % 2 === 0 ? -1 : 1);

      results.push({
        date: new Date(current),
        solarStr: `${current.getFullYear()}年${current.getMonth() + 1}月${current.getDate()}日`,
        lunarStr: `農曆 ${lunar.lunarMonthStr}${lunar.lunarDayStr}`,
        weekday: getWeekdayZh(current),
        stemBranch: sb.dayName + '日',
        luckLevel,
        yi: shuffledYi.slice(0, yiCount),
        ji: shuffledJi.slice(0, jiCount),
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return results;
}
