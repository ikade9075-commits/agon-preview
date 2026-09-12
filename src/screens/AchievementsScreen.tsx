import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { AchievementCard } from '../components/AchievementCard';
import { toArabicNumerals } from '../utils/hijriDate';
import { CATEGORIES } from '../data/azkarData';

export const AchievementsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, userStats, dailyProgress, getCategoryProgress, getDailyWirdOverallProgress } =
    useApp();

  const wirdProgress = getDailyWirdOverallProgress();
  const todayTotalAzkarDone = Object.values(dailyProgress.completedZikrMap).reduce(
    (acc, val) => acc + val,
    0
  );

  const unlockedCount = userStats.achievements.filter((a) => a.unlocked).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="إنجازي ومسيرتي"
        subtitle="تابع إحصائياتك ونموك في ذكر الله"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Stats 4-Grid Cards */}
        <View style={styles.statsGrid}>
          {/* Card 1: Today Azkar */}
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.cardShadow,
              },
            ]}
          >
            <View style={[styles.statIconBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="sparkles" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {toArabicNumerals(todayTotalAzkarDone)}
            </Text>
            <Text style={[styles.statTitle, { color: colors.textSecondary }]}>أذكار اليوم</Text>
          </View>

          {/* Card 2: Streak Days */}
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.cardShadow,
              },
            ]}
          >
            <View style={[styles.statIconBadge, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="flame" size={20} color={colors.accentDark} />
            </View>
            <Text style={[styles.statValue, { color: colors.accentDark }]}>
              {toArabicNumerals(userStats.streakDays)}
            </Text>
            <Text style={[styles.statTitle, { color: colors.textSecondary }]}>أيام الالتزام</Text>
          </View>

          {/* Card 3: Today Tasbeeh */}
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.cardShadow,
              },
            ]}
          >
            <View style={[styles.statIconBadge, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="radio-button-on" size={20} color="#3B82F6" />
            </View>
            <Text style={[styles.statValue, { color: '#3B82F6' }]}>
              {toArabicNumerals(dailyProgress.tasbeehCountToday)}
            </Text>
            <Text style={[styles.statTitle, { color: colors.textSecondary }]}>تسبيحات اليوم</Text>
          </View>

          {/* Card 4: Daily Wird % */}
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.cardShadow,
              },
            ]}
          >
            <View style={[styles.statIconBadge, { backgroundColor: colors.successLight }]}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            </View>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {toArabicNumerals(wirdProgress.percentage)}%
            </Text>
            <Text style={[styles.statTitle, { color: colors.textSecondary }]}>إنجاز الورد</Text>
          </View>
        </View>

        {/* Section: Category Progress Breakdown */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            نسبة إنجاز أقسام اليوم
          </Text>
        </View>

        <View
          style={[
            styles.breakdownCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {CATEGORIES.map((cat) => {
            const prog = getCategoryProgress(cat.id);
            return (
              <View key={cat.id} style={styles.categoryRow}>
                <View style={styles.catNameCol}>
                  <Text style={[styles.catNameText, { color: colors.textPrimary }]}>
                    {cat.title}
                  </Text>
                  <Text style={[styles.catFractionText, { color: colors.textMuted }]}>
                    {toArabicNumerals(prog.completed)} / {toArabicNumerals(prog.total)}
                  </Text>
                </View>

                <View style={[styles.catTrack, { backgroundColor: colors.surfaceSubtle }]}>
                  <View
                    style={[
                      styles.catFill,
                      {
                        width: `${prog.percentage}%`,
                        backgroundColor: prog.percentage === 100 ? colors.success : cat.color,
                      },
                    ]}
                  />
                </View>

                <Text
                  style={[
                    styles.catPercentText,
                    {
                      color: prog.percentage === 100 ? colors.success : colors.textSecondary,
                    },
                  ]}
                >
                  {toArabicNumerals(prog.percentage)}%
                </Text>
              </View>
            );
          })}
        </View>

        {/* Section: Achievements & Badges */}
        <View style={styles.sectionHeader}>
          <View style={[styles.badgeCountPill, { backgroundColor: colors.accentLight }]}>
            <Text style={[styles.badgeCountText, { color: colors.accentDark }]}>
              {toArabicNumerals(unlockedCount)} / {toArabicNumerals(userStats.achievements.length)} أوسمة
            </Text>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            الأوسمة والإنجازات
          </Text>
        </View>

        <View style={styles.achievementsList}>
          {userStats.achievements.map((ach) => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
    marginTop: 12,
  },
  statCard: {
    width: '48.5%',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    alignItems: 'flex-start',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      },
    }),
  },
  statIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  statTitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  badgeCountPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeCountText: {
    fontSize: 12,
    fontWeight: '700',
  },
  breakdownCard: {
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    gap: 14,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catNameCol: {
    width: 110,
    alignItems: 'flex-start',
  },
  catNameText: {
    fontSize: 13,
    fontWeight: '700',
  },
  catFractionText: {
    fontSize: 10,
    marginTop: 1,
  },
  catTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  catFill: {
    height: '100%',
    borderRadius: 4,
  },
  catPercentText: {
    fontSize: 12,
    fontWeight: '700',
    width: 38,
    textAlign: 'left',
  },
  achievementsList: {
    marginTop: 4,
  },
});
