export type CategoryId =
  | 'morning'
  | 'evening'
  | 'after_prayer'
  | 'sleep'
  | 'waking_up'
  | 'misc'
  | 'tasbeeh'
  | 'favorites';

export interface ZikrItem {
  id: string;
  categoryId: CategoryId;
  text: string;
  count: number; // Target repeat count
  fadl?: string; // Virtue / benefit
  source?: string; // Hadith source / book reference
  order: number;
}

export interface CategoryInfo {
  id: CategoryId;
  title: string;
  subtitle: string;
  iconName: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5' | 'Feather';
  color: string;
  accentColor: string;
  bgGradient: [string, string];
  estimatedMinutes: number;
  description: string;
}

export interface TasbeehDhikr {
  id: string;
  text: string;
  target: number;
  count: number;
  totalCount: number;
  meaning?: string;
  fadl?: string;
  isCustom?: boolean;
}

export interface DailyProgress {
  dateString: string; // YYYY-MM-DD
  completedZikrMap: Record<string, number>; // zikrId -> current count done today
  completedCategoryIds: string[];
  tasbeehCountToday: number;
  wirdCompleted: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'wird' | 'tasbeeh' | 'streak' | 'general';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface ReminderSetting {
  id: string;
  title: string;
  time: string; // "06:30"
  enabled: boolean;
  categoryId: CategoryId;
}

export type FontSizeOption = 'small' | 'normal' | 'large' | 'xlarge';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  themeMode: ThemeMode;
  fontSize: FontSizeOption;
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  autoNextOnComplete: boolean;
  reminders: ReminderSetting[];
}

export interface UserStats {
  streakDays: number;
  lastActiveDate: string;
  totalAzkarCompleted: number;
  totalTasbeehCompleted: number;
  daysActiveCount: number;
  achievements: Achievement[];
}
