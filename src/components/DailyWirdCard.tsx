import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { getGreeting, toArabicNumerals } from '../utils/hijriDate';

interface DailyWirdCardProps {
  onStartPress: () => void;
}

export const DailyWirdCard: React.FC<DailyWirdCardProps> = ({ onStartPress }) => {
  const { colors, getDailyWirdOverallProgress, userStats } = useApp();
  const greeting = getGreeting();
  const progress = getDailyWirdOverallProgress();
  const isCompleted = progress.percentage === 100 && progress.total > 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.cardShadow,
        },
      ]}
    >
      {/* Decorative top pill */}
      <View style={styles.headerRow}>
        <View style={[styles.greetingBadge, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name={greeting.icon as any} size={15} color={colors.primary} />
          <Text style={[styles.greetingText, { color: colors.primary }]}>{greeting.title}</Text>
        </View>

        <View style={styles.percentBadge}>
          <Text style={[styles.percentNumber, { color: colors.primary }]}>
            {toArabicNumerals(progress.percentage)}%
          </Text>
          <Text style={[styles.percentLabel, { color: colors.textMuted }]}>إنجاز الورد</Text>
        </View>
      </View>

      {/* Motivational message */}
      <Text style={[styles.motivationalText, { color: colors.textPrimary }]}>
        {isCompleted
          ? '🎉 هنيئاً لك! أتممت وردك اليومي، تقبل الله طاعتك وزادك نوراً.'
          : greeting.subtitle}
      </Text>

      {/* Progress Bar Container */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressCountText, { color: colors.textSecondary }]}>
            أتممت{' '}
            <Text style={{ fontWeight: '800', color: colors.primary }}>
              {toArabicNumerals(progress.completed)}
            </Text>{' '}
            من {toArabicNumerals(progress.total)} ذِكراً
          </Text>
          <Text style={[styles.streakSubText, { color: colors.accentDark }]}>
            🔥 {toArabicNumerals(userStats.streakDays)} أيام التزام
          </Text>
        </View>

        <View style={[styles.progressBarTrack, { backgroundColor: colors.surfaceSubtle }]}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(Math.max(progress.percentage, 4), 100)}%`,
                backgroundColor: isCompleted ? colors.success : colors.primary,
              },
            ]}
          />
        </View>
      </View>

      {/* Call to Action Button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          {
            backgroundColor: isCompleted ? colors.success : colors.primary,
          },
        ]}
        onPress={onStartPress}
        activeOpacity={0.85}
      >
        <Ionicons
          name={isCompleted ? 'checkmark-circle' : 'sparkles'}
          size={18}
          color="#FFFFFF"
        />
        <Text style={styles.actionButtonText}>
          {isCompleted
            ? 'مراجعة الأذكار'
            : progress.completed > 0
            ? 'متابعة ورد اليوم'
            : 'ابدأ وردك الآن'}
        </Text>
        <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  greetingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  greetingText: {
    fontSize: 13,
    fontWeight: '700',
  },
  percentBadge: {
    alignItems: 'flex-end',
  },
  percentNumber: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  percentLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  motivationalText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'right',
    marginVertical: 6,
  },
  progressSection: {
    marginTop: 8,
    marginBottom: 14,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressCountText: {
    fontSize: 13,
  },
  streakSubText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 10,
    borderRadius: 6,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
