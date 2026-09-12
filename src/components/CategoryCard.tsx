import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { CategoryInfo } from '../types';
import { toArabicNumerals } from '../utils/hijriDate';

interface CategoryCardProps {
  category: CategoryInfo;
  onPress: () => void;
  layout?: 'grid' | 'list';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  layout = 'list',
}) => {
  const { colors, getCategoryProgress } = useApp();
  const progress = getCategoryProgress(category.id);
  const isCompleted = progress.percentage === 100 && progress.total > 0;

  if (layout === 'grid') {
    return (
      <TouchableOpacity
        style={[
          styles.gridContainer,
          {
            backgroundColor: colors.surface,
            borderColor: isCompleted ? colors.success : colors.border,
            shadowColor: colors.cardShadow,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.gridTopRow}>
          <View
            style={[
              styles.gridIconBadge,
              { backgroundColor: isCompleted ? colors.successLight : category.accentColor },
            ]}
          >
            <Ionicons
              name={category.iconName as any}
              size={24}
              color={isCompleted ? colors.success : category.color}
            />
          </View>
          {isCompleted ? (
            <View style={[styles.doneBadge, { backgroundColor: colors.successLight }]}>
              <Ionicons name="checkmark" size={14} color={colors.success} />
            </View>
          ) : progress.completed > 0 ? (
            <Text style={[styles.gridProgressBadge, { color: colors.primary }]}>
              {toArabicNumerals(progress.completed)}/{toArabicNumerals(progress.total)}
            </Text>
          ) : (
            <Text style={[styles.gridTimeBadge, { color: colors.textMuted }]}>
              {toArabicNumerals(category.estimatedMinutes)} د
            </Text>
          )}
        </View>

        <Text style={[styles.gridTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {category.title}
        </Text>
        <Text style={[styles.gridSubtitle, { color: colors.textMuted }]} numberOfLines={1}>
          {category.subtitle}
        </Text>

        <View style={[styles.progressBarTrack, { backgroundColor: colors.surfaceSubtle }]}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progress.percentage}%`,
                backgroundColor: isCompleted ? colors.success : category.color,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.listContainer,
        {
          backgroundColor: colors.surface,
          borderColor: isCompleted ? colors.success : colors.border,
          shadowColor: colors.cardShadow,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.listMainRow}>
        <View
          style={[
            styles.listIconBadge,
            { backgroundColor: isCompleted ? colors.successLight : category.accentColor },
          ]}
        >
          <Ionicons
            name={category.iconName as any}
            size={26}
            color={isCompleted ? colors.success : category.color}
          />
        </View>

        <View style={styles.listTextContainer}>
          <View style={styles.titleWithBadge}>
            <Text style={[styles.listTitle, { color: colors.textPrimary }]}>
              {category.title}
            </Text>
            {isCompleted && (
              <View style={[styles.completeTag, { backgroundColor: colors.successLight }]}>
                <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                <Text style={[styles.completeTagText, { color: colors.success }]}>مكتمل</Text>
              </View>
            )}
          </View>
          <Text style={[styles.listSubtitle, { color: colors.textMuted }]} numberOfLines={1}>
            {category.subtitle}
          </Text>
        </View>

        <View style={styles.listLeftInfo}>
          <Text style={[styles.listProgressText, { color: isCompleted ? colors.success : colors.textSecondary }]}>
            {toArabicNumerals(progress.completed)}/{toArabicNumerals(progress.total)}
          </Text>
          <Text style={[styles.listEstimateText, { color: colors.textMuted }]}>
            ~{toArabicNumerals(category.estimatedMinutes)} د
          </Text>
        </View>
      </View>

      <View style={[styles.progressBarTrack, { backgroundColor: colors.surfaceSubtle }]}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${progress.percentage}%`,
              backgroundColor: isCompleted ? colors.success : colors.primary,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    flex: 1,
    minHeight: 135,
    justifyContent: 'space-between',
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
  gridTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gridIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridProgressBadge: {
    fontSize: 12,
    fontWeight: '700',
  },
  gridTimeBadge: {
    fontSize: 11,
    fontWeight: '500',
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  gridSubtitle: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 2,
    marginBottom: 6,
  },
  listContainer: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 6,
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
  listMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  listIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTextContainer: {
    flex: 1,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  completeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  completeTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  listSubtitle: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 2,
  },
  listLeftInfo: {
    alignItems: 'flex-start',
    minWidth: 44,
  },
  listProgressText: {
    fontSize: 13,
    fontWeight: '700',
  },
  listEstimateText: {
    fontSize: 11,
    marginTop: 2,
  },
  progressBarTrack: {
    height: 5,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
