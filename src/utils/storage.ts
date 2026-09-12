import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, DailyProgress, TasbeehDhikr, UserStats } from '../types';
import { INITIAL_ACHIEVEMENTS, INITIAL_TASBEEH_LIST } from '../data/azkarData';
import { getTodayDateString } from './hijriDate';

const STORAGE_KEYS = {
  SETTINGS: '@zikri_settings_v1',
  DAILY_PROGRESS: '@zikri_daily_progress_v1',
  FAVORITES: '@zikri_favorites_v1',
  TASBEEH_LIST: '@zikri_tasbeeh_list_v1',
  ACTIVE_TASBEEH_ID: '@zikri_active_tasbeeh_id_v1',
  USER_STATS: '@zikri_user_stats_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'light',
  fontSize: 'normal',
  vibrationEnabled: true,
  soundEnabled: true,
  autoNextOnComplete: false,
  reminders: [
    {
      id: 'rem_morning',
      title: 'تذكير أذكار الصباح',
      time: '06:00',
      enabled: true,
      categoryId: 'morning',
    },
    {
      id: 'rem_evening',
      title: 'تذكير أذكار المساء',
      time: '17:00',
      enabled: true,
      categoryId: 'evening',
    },
    {
      id: 'rem_sleep',
      title: 'تذكير أذكار النوم',
      time: '22:30',
      enabled: true,
      categoryId: 'sleep',
    },
    {
      id: 'rem_daily',
      title: 'تذكير الورد اليومي',
      time: '12:00',
      enabled: false,
      categoryId: 'misc',
    },
  ],
};

export const DEFAULT_USER_STATS: UserStats = {
  streakDays: 1,
  lastActiveDate: getTodayDateString(),
  totalAzkarCompleted: 0,
  totalTasbeehCompleted: 0,
  daysActiveCount: 1,
  achievements: INITIAL_ACHIEVEMENTS,
};

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Error loading settings', e);
  }
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Error saving settings', e);
  }
}

export async function loadDailyProgress(): Promise<DailyProgress> {
  const today = getTodayDateString();
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
    if (raw) {
      const parsed: DailyProgress = JSON.parse(raw);
      if (parsed.dateString === today) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading daily progress', e);
  }
  // New day initial progress
  return {
    dateString: today,
    completedZikrMap: {},
    completedCategoryIds: [],
    tasbeehCountToday: 0,
    wirdCompleted: false,
  };
}

export async function saveDailyProgress(progress: DailyProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.warn('Error saving daily progress', e);
  }
}

export async function loadFavorites(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error loading favorites', e);
  }
  return ['m_4', 'm_1', 'e_4', 'misc_3']; // Default favorites (Sayyid al-Istighfar, Ayat al-Kursi, Du'a Yunus)
}

export async function saveFavorites(favorites: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (e) {
    console.warn('Error saving favorites', e);
  }
}

export async function loadTasbeehList(): Promise<TasbeehDhikr[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.TASBEEH_LIST);
    if (raw) {
      const parsed: TasbeehDhikr[] = JSON.parse(raw);
      if (parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error loading tasbeeh list', e);
  }
  return INITIAL_TASBEEH_LIST;
}

export async function saveTasbeehList(list: TasbeehDhikr[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TASBEEH_LIST, JSON.stringify(list));
  } catch (e) {
    console.warn('Error saving tasbeeh list', e);
  }
}

export async function loadActiveTasbeehId(): Promise<string> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_TASBEEH_ID);
    if (raw) return raw;
  } catch (e) {
    // Ignore
  }
  return INITIAL_TASBEEH_LIST[0].id;
}

export async function saveActiveTasbeehId(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_TASBEEH_ID, id);
  } catch (e) {
    // Ignore
  }
}

export async function loadUserStats(): Promise<UserStats> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
    if (raw) {
      const parsed: UserStats = JSON.parse(raw);
      const today = getTodayDateString();

      // Check streak logic
      if (parsed.lastActiveDate !== today) {
        const lastDate = new Date(parsed.lastActiveDate);
        const currDate = new Date(today);
        const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Continuous day
          parsed.streakDays += 1;
        } else if (diffDays > 1) {
          // Broken streak
          parsed.streakDays = 1;
        }
        parsed.daysActiveCount = (parsed.daysActiveCount || 0) + 1;
        parsed.lastActiveDate = today;
        await saveUserStats(parsed);
      }

      // Merge missing achievements if any
      const existingIds = new Set(parsed.achievements.map((a) => a.id));
      INITIAL_ACHIEVEMENTS.forEach((a) => {
        if (!existingIds.has(a.id)) {
          parsed.achievements.push(a);
        }
      });

      return parsed;
    }
  } catch (e) {
    console.warn('Error loading user stats', e);
  }
  return DEFAULT_USER_STATS;
}

export async function saveUserStats(stats: UserStats): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  } catch (e) {
    console.warn('Error saving user stats', e);
  }
}

export async function clearAllAppData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.DAILY_PROGRESS,
      STORAGE_KEYS.FAVORITES,
      STORAGE_KEYS.TASBEEH_LIST,
      STORAGE_KEYS.ACTIVE_TASBEEH_ID,
      STORAGE_KEYS.USER_STATS,
    ]);
  } catch (e) {
    console.warn('Error clearing app data', e);
  }
}
