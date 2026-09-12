// Accurate Hijri & Gregorian date utilities in Arabic

const ARABIC_MONTHS_HIJRI = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

const ARABIC_MONTHS_GREGORIAN = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

const ARABIC_DAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

export function toArabicNumerals(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .replace(/[0-9]/g, (w) => arabicDigits[+w]);
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getArabicGregorianDate(date: Date = new Date()): string {
  const dayName = ARABIC_DAYS[date.getDay()];
  const day = date.getDate();
  const monthName = ARABIC_MONTHS_GREGORIAN[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}، ${toArabicNumerals(day)} ${monthName} ${toArabicNumerals(year)} م`;
}

// Kuwaiti algorithm / Umm al-Qura approximation for Hijri Date
export function getArabicHijriDate(date: Date = new Date()): string {
  try {
    // If Intl DateTimeFormat with islamic-umalqura is supported
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const formatted = formatter.format(date);
    if (formatted && formatted.length > 3) {
      return `${formatted} هـ`;
    }
  } catch (e) {
    // Fallback calculation
  }

  // Algorithmic fallback
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (day > 4) b = -10;
    }
  }

  let jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524;

  b = 0;
  if (jd > 2299160) {
    a = Math.floor((jd - 1867216.25) / 36524.25);
    b = 1 + a - Math.floor(a / 4);
  }
  let bb = jd + b + 1524;
  let cc = Math.floor((bb - 122.1) / 365.25);
  let dd = Math.floor(365.25 * cc);
  let ee = Math.floor((bb - dd) / 30.6001);
  day = bb - dd - Math.floor(30.6001 * ee);
  month = ee - 1;
  if (ee > 13) {
    cc += 1;
    month = ee - 13;
  }
  year = cc - 4716;

  let iyear = 10631 / 30;
  let epochastro = 1948084;

  let shift1 = 8.01 / 60;

  let z = jd - epochastro;
  let cyc = Math.floor(z / 10631);
  z = z - 10631 * cyc;
  let j = Math.floor((z - shift1) / iyear);
  let iy = 30 * cyc + j;
  z = z - Math.floor(j * iyear + shift1);
  let im = Math.floor((z + 28.5001) / 29.5);
  if (im === 13) im = 12;
  let id = z - Math.floor(29.5001 * im - 29);

  let hijriDay = id;
  let hijriMonthName = ARABIC_MONTHS_HIJRI[im - 1] || 'ربيع الأول';
  let hijriYear = iy + 1;

  return `${toArabicNumerals(hijriDay)} ${hijriMonthName} ${toArabicNumerals(hijriYear)} هـ`;
}

export function getGreeting(): { title: string; subtitle: string; icon: string } {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) {
    return {
      title: 'صباح الخير والبركة',
      subtitle: 'ابدأ يومك بذكر الله تنل سكينته وحفظه',
      icon: 'sunny',
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      title: 'طاب يومك بذكر الله',
      subtitle: 'ألا بذكر الله تطمئن القلوب وتنشرح الصدور',
      icon: 'partly-sunny',
    };
  } else if (hour >= 17 && hour < 22) {
    return {
      title: 'مساء الخير والسكينة',
      subtitle: 'حصّن نفسك بأذكار المساء واختم يومك بخير',
      icon: 'moon',
    };
  } else {
    return {
      title: 'طابت ليلتك',
      subtitle: 'اذكر ربك قبل منامك لتبيت في حفظ الرحمن',
      icon: 'bed',
    };
  }
}
