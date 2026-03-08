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

/** Year stem-branch (e.g. 乙巳年) — based on traditional Chinese year reckoning */
export function getYearStemBranch(year: number): { stemBranch: string; zodiac: string } {
  // Reference: 1984 = 甲子年
  const offset = ((year - 1984) % 60 + 60) % 60;
  const stemIdx = offset % 10;
  const branchIdx = offset % 12;
  return {
    stemBranch: HEAVENLY_STEMS[stemIdx] + EARTHLY_BRANCHES[branchIdx] + '年',
    zodiac: ZODIAC[branchIdx],
  };
}

/** Month stem-branch (approx.) */
export function getMonthStemBranch(date: Date): string {
  // Month branch: 寅 = month 1 (Feb), cycle through EARTHLY_BRANCHES offset by 2
  const mBranchIdx = ((date.getMonth() + 2) % 12);
  // Month stem depends on year stem: year stem idx determines month stem base
  const yearOffset = ((date.getFullYear() - 1984) % 60 + 60) % 60;
  const yearStemIdx = yearOffset % 10;
  // Month stem base: (yearStemIdx % 5) * 2
  const mStemBase = (yearStemIdx % 5) * 2;
  const mStemIdx = (mStemBase + date.getMonth()) % 10;
  return HEAVENLY_STEMS[mStemIdx] + EARTHLY_BRANCHES[mBranchIdx] + '月';
}

const SPECIAL_NOTES_POOL = [
  '此日五行屬土，利穩固之事。',
  '此日納音為金，宜金屬相關事宜。',
  '逢月德日，諸事皆宜，尤利婦女。',
  '逢天德日，主大吉大利，宜重大決策。',
  '此日宜祈福求神，心誠則靈。',
  '逢三合日，貴人相助，諸事順遂。',
  '此日沖煞較輕，擇時尤為重要。',
  '宜配合黃道時辰，效果更佳。',
  '逢祿日，財運亨通，宜求財納財。',
  '此日陽氣旺盛，適合開創新局。',
];

export function getSpecialNotes(date: Date): string[] {
  // Deterministically pick 1-2 notes based on date
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const idx1 = seed % SPECIAL_NOTES_POOL.length;
  const idx2 = (seed * 7 + 3) % SPECIAL_NOTES_POOL.length;
  return idx1 === idx2 ? [SPECIAL_NOTES_POOL[idx1]] : [SPECIAL_NOTES_POOL[idx1], SPECIAL_NOTES_POOL[idx2]];
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
  stemBranch: string;       // day stem-branch e.g. 甲子日
  yearStemBranch: string;   // e.g. 乙巳年 (生肖：蛇)
  monthStemBranch: string;  // e.g. 甲寅月
  zodiac: string;           // e.g. 蛇
  luckLevel: LuckLevel;
  yi: string[];             // full list (all activities)
  ji: string[];             // full list (all avoids)
  specialNotes: string[];   // special notes for the day
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
      const yearInfo = getYearStemBranch(current.getFullYear());
      const monthSB = getMonthStemBranch(current);

      results.push({
        date: new Date(current),
        solarStr: `${current.getFullYear()}年${current.getMonth() + 1}月${current.getDate()}日`,
        lunarStr: `農曆 ${lunar.lunarMonthStr}${lunar.lunarDayStr}`,
        weekday: getWeekdayZh(current),
        stemBranch: sb.dayName + '日',
        yearStemBranch: yearInfo.stemBranch,
        monthStemBranch: monthSB,
        zodiac: yearInfo.zodiac,
        luckLevel,
        yi: activities.yi,
        ji: activities.ji,
        specialNotes: getSpecialNotes(current),
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return results;
}

// ─── 時辰 (Auspicious Hours) ──────────────────────────────────────────────────

const HOUR_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const HOUR_TIMES = [
  '23:00–01:00', '01:00–03:00', '03:00–05:00', '05:00–07:00',
  '07:00–09:00', '09:00–11:00', '11:00–13:00', '13:00–15:00',
  '15:00–17:00', '17:00–19:00', '19:00–21:00', '21:00–23:00',
];

/**
 * 五鼠遁日起時法 — given the day's stem index (0-9), return the stem index of 子時.
 * 甲/己(0,5)→甲(0)  乙/庚(1,6)→丙(2)  丙/辛(2,7)→戊(4)  丁/壬(3,8)→庚(6)  戊/癸(4,9)→壬(8)
 */
function getHourStartStem(dayStemIdx: number): number {
  return (dayStemIdx % 5) * 2;
}

/** 三合 groups: each branch's two san-he partners */
const SAN_HE: Record<number, number[]> = {
  0: [4, 8],   // 子–辰–申
  1: [5, 9],   // 丑–巳–酉
  2: [6, 10],  // 寅–午–戌
  3: [7, 11],  // 卯–未–亥
  4: [8, 0],
  5: [9, 1],
  6: [10, 2],
  7: [11, 3],
  8: [0, 4],
  9: [1, 5],
  10: [2, 6],
  11: [3, 7],
};

/** 六合 pairs */
const LIU_HE: Record<number, number> = {
  0: 1, 1: 0,   // 子–丑
  2: 11, 11: 2, // 寅–亥
  3: 10, 10: 3, // 卯–戌
  4: 9, 9: 4,   // 辰–酉
  5: 8, 8: 5,   // 巳–申
  6: 7, 7: 6,   // 午–未
};

/** 六沖 pairs */
const LIU_CHONG: Record<number, number> = {
  0: 6, 6: 0,   // 子–午
  1: 7, 7: 1,   // 丑–未
  2: 8, 8: 2,   // 寅–申
  3: 9, 9: 3,   // 卯–酉
  4: 10, 10: 4, // 辰–戌
  5: 11, 11: 5, // 巳–亥
};

/** 吉神 labels for flavor */
const JI_SHEN: string[] = ['天德', '月德', '天乙', '青龍', '明堂', '金匱', '寶光'];
/** 凶神 labels */
const XIONG_SHEN: string[] = ['勾陳', '朱雀', '白虎', '天牢', '元武', '天刑'];

export interface HourInfo {
  branch: string;       // 子, 丑, …
  name: string;         // 子時, 丑時, …
  timeRange: string;    // 23:00–01:00
  stemBranch: string;   // 甲子, 乙丑, …
  luckLevel: LuckLevel;
  shen: string;         // auspicious or inauspicious deity label
}

export function getAuspiciousHours(date: Date): HourInfo[] {
  const daySB = getStemBranch(date);
  const dayStemIdx = HEAVENLY_STEMS.indexOf(daySB.stem);
  const dayBranchIdx = EARTHLY_BRANCHES.indexOf(daySB.branch);
  const startStem = getHourStartStem(dayStemIdx);

  // Deterministic seed for shen selection
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

  return HOUR_BRANCHES.map((branch, i) => {
    const hourStemIdx = (startStem + i) % 10;
    const hourBranchIdx = i; // 0=子, 1=丑, …
    const stemBranch = HEAVENLY_STEMS[hourStemIdx] + branch;
    const isYangStem = hourStemIdx % 2 === 0;

    // Determine luck
    const isSanHe = SAN_HE[dayBranchIdx]?.includes(hourBranchIdx) || dayBranchIdx === hourBranchIdx;
    const isLiuHe = LIU_HE[dayBranchIdx] === hourBranchIdx;
    const isChong = LIU_CHONG[dayBranchIdx] === hourBranchIdx;

    let luckLevel: LuckLevel;
    let shen: string;

    if (isChong) {
      luckLevel = '凶';
      shen = XIONG_SHEN[(seed + i) % XIONG_SHEN.length];
    } else if (isSanHe && isYangStem) {
      luckLevel = '大吉';
      shen = JI_SHEN[(seed + i) % JI_SHEN.length];
    } else if (isSanHe || isLiuHe) {
      luckLevel = '吉';
      shen = JI_SHEN[(seed + i + 2) % JI_SHEN.length];
    } else if (!isYangStem && hourBranchIdx % 4 === 3) {
      luckLevel = '凶';
      shen = XIONG_SHEN[(seed + i + 1) % XIONG_SHEN.length];
    } else {
      luckLevel = '平';
      shen = '';
    }

    return {
      branch,
      name: branch + '時',
      timeRange: HOUR_TIMES[i],
      stemBranch,
      luckLevel,
      shen,
    };
  });
}
