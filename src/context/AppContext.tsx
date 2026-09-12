import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import {
  Achievement,
  AppSettings,
  CategoryId,
  DailyProgress,
  FontSizeOption,
  TasbeehDhikr,
  ThemeMode,
  UserStats,
  ZikrItem,
} from '../types';
import { AZKAR_ITEMS, INITIAL_TASBEEH_LIST } from '../data/azkarData';
import { darkColors, lightColors, ThemeColors } from '../theme/colors';
import {
  clearAllAppData,
  DEFAULT_SETTINGS,
  DEFAULT_USER_STATS,
  loadActiveTasbeehId,
  loadDailyProgress,
  loadFavorites,
  loadSettings,
  loadTasbeehList,
  loadUserStats,
  saveActiveTasbeehId,
  saveDailyProgress,
  saveFavorites,
  saveSettings,
  saveTasbeehList,
  saveUserStats,
} from '../utils/storage';
import { playCounterClick, playSuccessChime, triggerHaptic } from '../utils/haptics';

interface AppContextType {
  // Theme & Styles
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  fontSize: FontSizeOption;
  setThemeMode: (mode: ThemeMode) => void;
  setFontSize: (size: FontSizeOption) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleReminder: (id: string) => void;
  updateReminderTime: (id: string, time: string) => void;

  // Azkar Progress
  dailyProgress: DailyProgress;
  incrementZikrCount: (zikrId: string) => boolean; // returns true if newly completed
  resetZikrCount: (zikrId: string) => void;
  resetCategory: (categoryId: CategoryId) => void;
  isZikrCompleted: (zikrId: string) => boolean;
  getZikrCurrentCount: (zikrId: string) => number;
  getCategoryProgress: (categoryId: CategoryId) => { completed: number; total: number; percentage: number };
  getDailyWirdOverallProgress: () => { completed: number; total: number; percentage: number };

  // Favorites
  favorites: string[];
  toggleFavorite: (zikrId: string) => void;
  isFavorite: (zikrId: string) => boolean;
  getFavoriteZikrs: () => ZikrItem[];

  // Tasbeeh
  tasbeehList: TasbeehDhikr[];
  activeTasbeeh: TasbeehDhikr;
  setActiveTasbeehId: (id: string) => void;
  incrementTasbeeh: () => void;
  resetActiveTasbeeh: () => void;
  setActiveTasbeehTarget: (target: number) => void;
  addCustomTasbeeh: (text: string, target: number, meaning?: string) => void;
  deleteCustomTasbeeh: (id: string) => void;

  // Stats & Achievements
  userStats: UserStats;
  resetAllStats: () => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Daily Progress State
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({
    dateString: '',
    completedZikrMap: {},
    completedCategoryIds: [],
    tasbeehCountToday: 0,
    wirdCompleted: false,
  });

  // Favorites State
  const [favorites, setFavorites] = useState<string[]>([]);

  // Tasbeeh State
  const [tasbeehList, setTasbeehList] = useState<TasbeehDhikr[]>(INITIAL_TASBEEH_LIST);
  const [activeTasbeehId, setActiveTasbeehIdState] = useState<string>(INITIAL_TASBEEH_LIST[0].id);

  // User Stats State
  const [userStats, setUserStats] = useState<UserStats>(DEFAULT_USER_STATS);

  // Initialize data on mount
  useEffect(() => {
    async function init() {
      const [savedSettings, savedProgress, savedFavs, savedTasbeeh, savedActiveId, savedStats] =
        await Promise.all([
          loadSettings(),
          loadDailyProgress(),
          loadFavorites(),
          loadTasbeehList(),
          loadActiveTasbeehId(),
          loadUserStats(),
        ]);

      setSettings(savedSettings);
      setDailyProgress(savedProgress);
      setFavorites(savedFavs);
      setTasbeehList(savedTasbeeh);
      setActiveTasbeehIdState(savedActiveId || savedTasbeeh[0].id);
      setUserStats(savedStats);
      setIsLoading(false);
    }
    init();
  }, []);

  // Theme resolution
  const isDark = useMemo(() => {
    if (settings.themeMode === 'system') {
      return systemScheme === 'dark';
    }
    return settings.themeMode === 'dark';
  }, [settings.themeMode, systemScheme]);

  const colors = useMemo(() => {
    return isDark ? darkColors : lightColors;
  }, [isDark]);

  // Update Settings
  const updateSettings = useCallback(
    (newSettings: Partial<AppSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        saveSettings(updated);
        return updated;
      });
    },
    []
  );

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      updateSettings({ themeMode: mode });
    },
    [updateSettings]
  );

  const setFontSize = useCallback(
    (fontSize: FontSizeOption) => {
      updateSettings({ fontSize });
    },
    [updateSettings]
  );

  const toggleReminder = useCallback(
    (id: string) => {
      setSettings((prev) => {
        const updatedReminders = prev.reminders.map((rem) =>
          rem.id === id ? { ...rem, enabled: !rem.enabled } : rem
        );
        const updated = { ...prev, reminders: updatedReminders };
        saveSettings(updated);
        return updated;
      });
    },
    []
  );

  const updateReminderTime = useCallback(
    (id: string, time: string) => {
      setSettings((prev) => {
        const updatedReminders = prev.reminders.map((rem) =>
          rem.id === id ? { ...rem, time } : rem
        );
        const updated = { ...prev, reminders: updatedReminders };
        saveSettings(updated);
        return updated;
      });
    },
    []
  );

  // Helper: check & update achievements
  const checkAchievements = useCallback(
    (
      newTotalAzkar: number,
      newTotalTasbeeh: number,
      streak: number,
      isMorningDone: boolean,
      isEveningDone: boolean,
      isWirdDone: boolean
    ) => {
      setUserStats((prev) => {
        let changed = false;
        const nowStr = new Date().toISOString();
        const updatedAchievements = prev.achievements.map((ach) => {
          let unlocked = ach.unlocked;
          let progress = ach.progress;

          if (ach.id === 'first_zikr') {
            progress = Math.min(newTotalAzkar, 1);
            if (!unlocked && progress >= 1) unlocked = true;
          } else if (ach.id === 'morning_complete') {
            if (isMorningDone) {
              progress = 1;
              unlocked = true;
            }
          } else if (ach.id === 'evening_complete') {
            if (isEveningDone) {
              progress = 1;
              unlocked = true;
            }
          } else if (ach.id === 'tasbeeh_100') {
            progress = Math.min(newTotalTasbeeh, 100);
            if (!unlocked && progress >= 100) unlocked = true;
          } else if (ach.id === 'tasbeeh_1000') {
            progress = Math.min(newTotalTasbeeh, 1000);
            if (!unlocked && progress >= 1000) unlocked = true;
          } else if (ach.id === 'streak_3') {
            progress = Math.min(streak, 3);
            if (!unlocked && progress >= 3) unlocked = true;
          } else if (ach.id === 'streak_7') {
            progress = Math.min(streak, 7);
            if (!unlocked && progress >= 7) unlocked = true;
          } else if (ach.id === 'full_wird_day') {
            if (isWirdDone) {
              progress = 1;
              unlocked = true;
            }
          }

          if (unlocked !== ach.unlocked || progress !== ach.progress) {
            changed = true;
            return {
              ...ach,
              unlocked,
              progress,
              unlockedAt: unlocked && !ach.unlocked ? nowStr : ach.unlockedAt,
            };
          }
          return ach;
        });

        if (changed) {
          const newStats: UserStats = {
            ...prev,
            achievements: updatedAchievements,
          };
          saveUserStats(newStats);
          return newStats;
        }
        return prev;
      });
    },
    []
  );

  // Favorites logic
  const isFavorite = useCallback(
    (zikrId: string): boolean => {
      return favorites.includes(zikrId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (zikrId: string) => {
      if (settings.vibrationEnabled) triggerHaptic('light');
      setFavorites((prev) => {
        let updated: string[];
        if (prev.includes(zikrId)) {
          updated = prev.filter((id) => id !== zikrId);
        } else {
          updated = [...prev, zikrId];
        }
        saveFavorites(updated);
        return updated;
      });
    },
    [settings.vibrationEnabled]
  );

  const getFavoriteZikrs = useCallback((): ZikrItem[] => {
    const map = new Map(AZKAR_ITEMS.map((item) => [item.id, item]));
    return favorites.map((id) => map.get(id)).filter(Boolean) as ZikrItem[];
  }, [favorites]);

  // Zikr count & progress
  const getZikrCurrentCount = useCallback(
    (zikrId: string): number => {
      return dailyProgress.completedZikrMap[zikrId] || 0;
    },
    [dailyProgress]
  );

  const isZikrCompleted = useCallback(
    (zikrId: string): boolean => {
      const zikr = AZKAR_ITEMS.find((item) => item.id === zikrId);
      if (!zikr) return false;
      const current = dailyProgress.completedZikrMap[zikrId] || 0;
      return current >= zikr.count;
    },
    [dailyProgress]
  );

  const getCategoryProgress = useCallback(
    (categoryId: CategoryId) => {
      if (categoryId === 'favorites') {
        const favList = getFavoriteZikrs();
        if (favList.length === 0) return { completed: 0, total: 0, percentage: 0 };
        const completed = favList.filter((item) => (dailyProgress.completedZikrMap[item.id] || 0) >= item.count).length;
        return {
          completed,
          total: favList.length,
          percentage: Math.round((completed / favList.length) * 100),
        };
      }

      const items = AZKAR_ITEMS.filter((item) => item.categoryId === categoryId);
      if (items.length === 0) return { completed: 0, total: 0, percentage: 0 };

      const completed = items.filter((item) => (dailyProgress.completedZikrMap[item.id] || 0) >= item.count).length;
      return {
        completed,
        total: items.length,
        percentage: Math.round((completed / items.length) * 100),
      };
    },
    [dailyProgress, getFavoriteZikrs]
  );

  const getDailyWirdOverallProgress = useCallback(() => {
    // Primary daily wird includes morning, evening, and after prayer
    const wirdCategories: CategoryId[] = ['morning', 'evening', 'after_prayer'];
    const wirdItems = AZKAR_ITEMS.filter((item) => wirdCategories.includes(item.categoryId));
    const completedCount = wirdItems.filter(
      (item) => (dailyProgress.completedZikrMap[item.id] || 0) >= item.count
    ).length;
    const total = wirdItems.length;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    return {
      completed: completedCount,
      total,
      percentage,
    };
  }, [dailyProgress]);

  const incrementZikrCount = useCallback(
    (zikrId: string): boolean => {
      const zikr = AZKAR_ITEMS.find((item) => item.id === zikrId);
      if (!zikr) return false;

      const prevCount = dailyProgress.completedZikrMap[zikrId] || 0;
      if (prevCount >= zikr.count) {
        // Already completed
        if (settings.vibrationEnabled) triggerHaptic('light');
        return false;
      }

      const newCount = prevCount + 1;
      const isJustCompleted = newCount === zikr.count;

      if (settings.vibrationEnabled) {
        triggerHaptic(isJustCompleted ? 'success' : 'light');
      }
      if (settings.soundEnabled) {
        if (isJustCompleted) playSuccessChime();
        else playCounterClick();
      }

      const newCompletedMap = {
        ...dailyProgress.completedZikrMap,
        [zikrId]: newCount,
      };

      // Check category completion
      const catItems = AZKAR_ITEMS.filter((item) => item.categoryId === zikr.categoryId);
      const catAllDone = catItems.every((item) => (newCompletedMap[item.id] || 0) >= item.count);

      const updatedCategoryIds = catAllDone
        ? Array.from(new Set([...dailyProgress.completedCategoryIds, zikr.categoryId]))
        : dailyProgress.completedCategoryIds;

      // Check total wird
      const wirdCatList: CategoryId[] = ['morning', 'evening', 'after_prayer'];
      const wirdItems = AZKAR_ITEMS.filter((item) => wirdCatList.includes(item.categoryId));
      const allWirdDone = wirdItems.every((item) => (newCompletedMap[item.id] || 0) >= item.count);

      const newProgress: DailyProgress = {
        ...dailyProgress,
        completedZikrMap: newCompletedMap,
        completedCategoryIds: updatedCategoryIds,
        wirdCompleted: allWirdDone,
      };

      setDailyProgress(newProgress);
      saveDailyProgress(newProgress);

      // Increment stats
      const newTotalAzkar = userStats.totalAzkarCompleted + 1;
      const updatedStats: UserStats = {
        ...userStats,
        totalAzkarCompleted: newTotalAzkar,
      };
      setUserStats(updatedStats);
      saveUserStats(updatedStats);

      checkAchievements(
        newTotalAzkar,
        userStats.totalTasbeehCompleted,
        userStats.streakDays,
        updatedCategoryIds.includes('morning'),
        updatedCategoryIds.includes('evening'),
        allWirdDone
      );

      return isJustCompleted;
    },
    [dailyProgress, settings.vibrationEnabled, settings.soundEnabled, userStats, checkAchievements]
  );

  const resetZikrCount = useCallback(
    (zikrId: string) => {
      if (settings.vibrationEnabled) triggerHaptic('medium');
      setDailyProgress((prev) => {
        const newMap = { ...prev.completedZikrMap };
        delete newMap[zikrId];
        const updated = {
          ...prev,
          completedZikrMap: newMap,
        };
        saveDailyProgress(updated);
        return updated;
      });
    },
    [settings.vibrationEnabled]
  );

  const resetCategory = useCallback(
    (categoryId: CategoryId) => {
      if (settings.vibrationEnabled) triggerHaptic('medium');
      setDailyProgress((prev) => {
        const items =
          categoryId === 'favorites'
            ? getFavoriteZikrs()
            : AZKAR_ITEMS.filter((item) => item.categoryId === categoryId);
        const newMap = { ...prev.completedZikrMap };
        items.forEach((item) => {
          delete newMap[item.id];
        });
        const updated = {
          ...prev,
          completedZikrMap: newMap,
          completedCategoryIds: prev.completedCategoryIds.filter((id) => id !== categoryId),
          wirdCompleted: false,
        };
        saveDailyProgress(updated);
        return updated;
      });
    },
    [getFavoriteZikrs, settings.vibrationEnabled]
  );

  // Tasbeeh Logic
  const activeTasbeeh = useMemo(() => {
    return tasbeehList.find((item) => item.id === activeTasbeehId) || tasbeehList[0];
  }, [tasbeehList, activeTasbeehId]);

  const setActiveTasbeehId = useCallback((id: string) => {
    setActiveTasbeehIdState(id);
    saveActiveTasbeehId(id);
  }, []);

  const incrementTasbeeh = useCallback(() => {
    if (settings.vibrationEnabled) triggerHaptic('light');
    if (settings.soundEnabled) playCounterClick();

    setTasbeehList((prevList) => {
      const updated = prevList.map((item) => {
        if (item.id === activeTasbeehId) {
          const newCount = item.count + 1;
          const newTotal = item.totalCount + 1;

          // If reached target, trigger success chime
          if (item.target > 0 && newCount === item.target) {
            if (settings.vibrationEnabled) triggerHaptic('success');
            if (settings.soundEnabled) playSuccessChime();
          }

          return {
            ...item,
            count: newCount,
            totalCount: newTotal,
          };
        }
        return item;
      });
      saveTasbeehList(updated);
      return updated;
    });

    // Update daily tasbeeh count
    setDailyProgress((prev) => {
      const updated = {
        ...prev,
        tasbeehCountToday: prev.tasbeehCountToday + 1,
      };
      saveDailyProgress(updated);
      return updated;
    });

    // Update user stats
    setUserStats((prev) => {
      const newTotalTasbeeh = prev.totalTasbeehCompleted + 1;
      const newStats = {
        ...prev,
        totalTasbeehCompleted: newTotalTasbeeh,
      };
      saveUserStats(newStats);
      checkAchievements(
        newStats.totalAzkarCompleted,
        newTotalTasbeeh,
        newStats.streakDays,
        dailyProgress.completedCategoryIds.includes('morning'),
        dailyProgress.completedCategoryIds.includes('evening'),
        dailyProgress.wirdCompleted
      );
      return newStats;
    });
  }, [activeTasbeehId, checkAchievements, dailyProgress, settings.soundEnabled, settings.vibrationEnabled]);

  const resetActiveTasbeeh = useCallback(() => {
    if (settings.vibrationEnabled) triggerHaptic('medium');
    setTasbeehList((prevList) => {
      const updated = prevList.map((item) => {
        if (item.id === activeTasbeehId) {
          return {
            ...item,
            count: 0,
          };
        }
        return item;
      });
      saveTasbeehList(updated);
      return updated;
    });
  }, [activeTasbeehId, settings.vibrationEnabled]);

  const setActiveTasbeehTarget = useCallback(
    (target: number) => {
      setTasbeehList((prevList) => {
        const updated = prevList.map((item) => {
          if (item.id === activeTasbeehId) {
            return {
              ...item,
              target,
            };
          }
          return item;
        });
        saveTasbeehList(updated);
        return updated;
      });
    },
    [activeTasbeehId]
  );

  const addCustomTasbeeh = useCallback(
    (text: string, target: number, meaning?: string) => {
      const newItem: TasbeehDhikr = {
        id: `custom_${Date.now()}`,
        text,
        target: target || 33,
        count: 0,
        totalCount: 0,
        meaning,
        isCustom: true,
      };
      setTasbeehList((prev) => {
        const updated = [...prev, newItem];
        saveTasbeehList(updated);
        return updated;
      });
      setActiveTasbeehId(newItem.id);
    },
    [setActiveTasbeehId]
  );

  const deleteCustomTasbeeh = useCallback(
    (id: string) => {
      setTasbeehList((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        saveTasbeehList(updated);
        return updated;
      });
      if (activeTasbeehId === id) {
        setActiveTasbeehId(INITIAL_TASBEEH_LIST[0].id);
      }
    },
    [activeTasbeehId, setActiveTasbeehId]
  );

  const resetAllStats = useCallback(async () => {
    await clearAllAppData();
    const today = new Date().toISOString().split('T')[0];
    setDailyProgress({
      dateString: today,
      completedZikrMap: {},
      completedCategoryIds: [],
      tasbeehCountToday: 0,
      wirdCompleted: false,
    });
    setFavorites(['m_4', 'm_1', 'e_4', 'misc_3']);
    setTasbeehList(INITIAL_TASBEEH_LIST);
    setActiveTasbeehIdState(INITIAL_TASBEEH_LIST[0].id);
    setUserStats(DEFAULT_USER_STATS);
  }, []);

  const value = useMemo(
    () => ({
      themeMode: settings.themeMode,
      isDark,
      colors,
      fontSize: settings.fontSize,
      setThemeMode,
      setFontSize,
      settings,
      updateSettings,
      toggleReminder,
      updateReminderTime,
      dailyProgress,
      incrementZikrCount,
      resetZikrCount,
      resetCategory,
      isZikrCompleted,
      getZikrCurrentCount,
      getCategoryProgress,
      getDailyWirdOverallProgress,
      favorites,
      toggleFavorite,
      isFavorite,
      getFavoriteZikrs,
      tasbeehList,
      activeTasbeeh,
      setActiveTasbeehId,
      incrementTasbeeh,
      resetActiveTasbeeh,
      setActiveTasbeehTarget,
      addCustomTasbeeh,
      deleteCustomTasbeeh,
      userStats,
      resetAllStats,
      isLoading,
    }),
    [
      settings,
      isDark,
      colors,
      setThemeMode,
      setFontSize,
      updateSettings,
      toggleReminder,
      updateReminderTime,
      dailyProgress,
      incrementZikrCount,
      resetZikrCount,
      resetCategory,
      isZikrCompleted,
      getZikrCurrentCount,
      getCategoryProgress,
      getDailyWirdOverallProgress,
      favorites,
      toggleFavorite,
      isFavorite,
      getFavoriteZikrs,
      tasbeehList,
      activeTasbeeh,
      setActiveTasbeehId,
      incrementTasbeeh,
      resetActiveTasbeeh,
      setActiveTasbeehTarget,
      addCustomTasbeeh,
      deleteCustomTasbeeh,
      userStats,
      resetAllStats,
      isLoading,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
