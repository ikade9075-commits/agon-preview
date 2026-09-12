import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { Achievement } from '../types';
import { toArabicNumerals } from '../utils/hijriDate';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const { colors } = useApp();
  const isUnlocked = achievement.unlocked;
  const progressPercent = Math.min(
    Math.round((achievement.progress / achievement.maxProgress) * 100),
    100
  );

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isUnlocked ? (colors.background === '#0D1512' ? '#182C22' : '#F4FAF6') : colors.surface,
          borderColor: isUnlocked ? colors.accent : colors.border,
          shadowColor: colors.cardShadow,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isUnlocked ? colors.accentLight : colors.surfaceSubtle,
          },
        ]}
      >
        <Ionicons
          name={achievement.icon as any}
          size={26}
          color={isUnlocked ? colors.accentDark : colors.textMuted}
        />
      </View>

      <View style={styles.contentCol}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              { color: isUnlocked ? colors.textPrimary : colors.textSecondary },
            ]}
          >
            {achievement.title}
          </Text>

          {isUnlocked ? (
            <View style={[styles.statusBadge, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="medal" size={12} color={colors.accentDark} />
              <Text style={[styles.statusText, { color: colors.accentDark }]}>مكتمل</Text>
            </View>
          ) : (
            <Text style={[styles.progressNumber, { color: colors.textMuted }]}>
              {toArabicNumerals(achievement.progress)} / {toArabicNumerals(achievement.maxProgress)}
            </Text>
          )}
        </View>

        <Text style={[styles.description, { color: colors.textMuted }]} numberOfLines={2}>
          {achievement.description}
        </Text>

        {!isUnlocked && (
          <View style={[styles.track, { backgroundColor: colors.surfaceSubtle }]}>
            <View
              style={[
                styles.fill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressNumber: {
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'right',
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
