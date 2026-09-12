import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { getArabicGregorianDate, getArabicHijriDate, toArabicNumerals } from '../utils/hijriDate';

interface HeaderProps {
  onSearchPress?: () => void;
  onAchievementsPress?: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchPress,
  onAchievementsPress,
  showBack = false,
  onBackPress,
  title,
  subtitle,
}) => {
  const { colors, userStats } = useApp();
  const hijri = getArabicHijriDate();
  const gregorian = getArabicGregorianDate();

  if (showBack) {
    return (
      <View style={[styles.headerContainer, { borderBottomColor: colors.borderLight }]}>
        <View style={styles.titleRow}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.surfaceSubtle }]}
            onPress={onBackPress}
            activeOpacity={0.7}
            accessibilityLabel="رجوع"
          >
            <Ionicons name="arrow-forward" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.titleCenter}>
            <Text style={[styles.screenTitle, { color: colors.textPrimary }]} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[styles.screenSubtitle, { color: colors.textMuted }]} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          {onSearchPress ? (
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.surfaceSubtle }]}
              onPress={onSearchPress}
              activeOpacity={0.7}
            >
              <Ionicons name="search-outline" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.headerContainer, { borderBottomColor: colors.borderLight }]}>
      <View style={styles.topRow}>
        {/* Right side: App Title & Logo */}
        <View style={styles.brandRow}>
          <View style={[styles.logoBadge, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="book" size={20} color={colors.primary} />
          </View>
          <View>
            <View style={styles.appNameRow}>
              <Text style={[styles.appName, { color: colors.textPrimary }]}>ذِكْرِي</Text>
              <View style={[styles.appBadge, { backgroundColor: colors.accentLight }]}>
                <Text style={[styles.appBadgeText, { color: colors.accentDark }]}>يومي</Text>
              </View>
            </View>
            <Text style={[styles.dateText, { color: colors.textMuted }]}>{hijri}</Text>
          </View>
        </View>

        {/* Left side: Streak & Quick Actions */}
        <View style={styles.actionsRow}>
          {onAchievementsPress && (
            <TouchableOpacity
              style={[styles.streakPill, { backgroundColor: colors.primaryLight }]}
              onPress={onAchievementsPress}
              activeOpacity={0.8}
            >
              <Ionicons name="flame" size={16} color={colors.accentDark} />
              <Text style={[styles.streakText, { color: colors.primary }]}>
                {toArabicNumerals(userStats.streakDays)} يوم
              </Text>
            </TouchableOpacity>
          )}

          {onSearchPress && (
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.surfaceSubtle }]}
              onPress={onSearchPress}
              activeOpacity={0.7}
              accessibilityLabel="بحث"
            >
              <Ionicons name="search-outline" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  appBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  appBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  screenSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
});
