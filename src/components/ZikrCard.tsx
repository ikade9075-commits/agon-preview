import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Share } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { ZikrItem } from '../types';
import { getZikrFontSize, getZikrLineHeight } from '../theme/typography';
import { toArabicNumerals } from '../utils/hijriDate';

interface ZikrCardProps {
  zikr: ZikrItem;
  index: number;
  totalInList: number;
  onNextPress?: () => void;
  isLast?: boolean;
}

export const ZikrCard: React.FC<ZikrCardProps> = ({
  zikr,
  index,
  totalInList,
  onNextPress,
  isLast = false,
}) => {
  const {
    colors,
    fontSize,
    incrementZikrCount,
    resetZikrCount,
    getZikrCurrentCount,
    isZikrCompleted,
    isFavorite,
    toggleFavorite,
  } = useApp();

  const [showFadl, setShowFadl] = useState(true);
  const currentCount = getZikrCurrentCount(zikr.id);
  const isDone = isZikrCompleted(zikr.id);
  const favorited = isFavorite(zikr.id);

  const textSize = getZikrFontSize(fontSize);
  const lineHeight = getZikrLineHeight(fontSize);

  const handleShare = async () => {
    try {
      let content = `${zikr.text}\n\n`;
      if (zikr.fadl) content += `فضل الذكر: ${zikr.fadl}\n`;
      if (zikr.source) content += `المصدر: ${zikr.source}\n`;
      content += `\nعبر تطبيق "ذِكري" - رفيقك اليومي للأذكار`;

      await Share.share({
        message: content,
        title: 'ذِكر من تطبيق ذِكري',
      });
    } catch (e) {
      // Ignore share cancellation
    }
  };

  const handleTap = () => {
    incrementZikrCount(zikr.id);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDone ? (colors.background === '#0D1512' ? '#142820' : '#F2FAF6') : colors.surface,
          borderColor: isDone ? colors.success : colors.border,
          shadowColor: colors.cardShadow,
        },
      ]}
    >
      {/* Top Meta Bar */}
      <View style={styles.topMetaRow}>
        {/* Right: Card Index & Count Badge */}
        <View style={styles.indexBadgeRow}>
          <View style={[styles.indexNumberBadge, { backgroundColor: colors.surfaceSubtle }]}>
            <Text style={[styles.indexNumberText, { color: colors.textSecondary }]}>
              {toArabicNumerals(index + 1)} / {toArabicNumerals(totalInList)}
            </Text>
          </View>

          <View
            style={[
              styles.targetBadge,
              {
                backgroundColor: isDone ? colors.successLight : colors.primaryLight,
              },
            ]}
          >
            <Ionicons
              name={isDone ? 'checkmark-circle' : 'repeat'}
              size={14}
              color={isDone ? colors.success : colors.primary}
            />
            <Text
              style={[
                styles.targetBadgeText,
                { color: isDone ? colors.success : colors.primary },
              ]}
            >
              {toArabicNumerals(zikr.count)} {zikr.count === 1 ? 'مرة' : zikr.count === 2 ? 'مرتان' : 'مرات'}
            </Text>
          </View>
        </View>

        {/* Left: Quick Actions (Favorite, Share, Reset) */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.actionIconButton,
              { backgroundColor: colors.surfaceSubtle },
            ]}
            onPress={() => toggleFavorite(zikr.id)}
            activeOpacity={0.7}
            accessibilityLabel="إضافة للمفضلة"
          >
            <Ionicons
              name={favorited ? 'star' : 'star-outline'}
              size={18}
              color={favorited ? colors.accent : colors.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionIconButton,
              { backgroundColor: colors.surfaceSubtle },
            ]}
            onPress={handleShare}
            activeOpacity={0.7}
            accessibilityLabel="مشاركة الذكر"
          >
            <Ionicons name="share-social-outline" size={17} color={colors.textSecondary} />
          </TouchableOpacity>

          {currentCount > 0 && (
            <TouchableOpacity
              style={[
                styles.actionIconButton,
                { backgroundColor: colors.surfaceSubtle },
              ]}
              onPress={() => resetZikrCount(zikr.id)}
              activeOpacity={0.7}
              accessibilityLabel="تصفير العداد"
            >
              <Ionicons name="refresh-outline" size={17} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Zikr Text */}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.zikrText,
            {
              color: colors.textPrimary,
              fontSize: textSize,
              lineHeight: lineHeight,
            },
          ]}
          selectable
        >
          {zikr.text}
        </Text>
      </View>

      {/* Fadl & Source Box */}
      {(zikr.fadl || zikr.source) && (
        <View
          style={[
            styles.fadlContainer,
            {
              backgroundColor: colors.surfaceSubtle,
              borderLeftColor: colors.accent,
            },
          ]}
        >
          {zikr.fadl ? (
            <View style={styles.fadlRow}>
              <Ionicons name="sparkles" size={14} color={colors.accent} style={{ marginTop: 2 }} />
              <Text style={[styles.fadlText, { color: colors.textSecondary }]}>
                {zikr.fadl}
              </Text>
            </View>
          ) : null}

          {zikr.source ? (
            <View style={styles.sourceRow}>
              <Ionicons name="book-outline" size={12} color={colors.textMuted} />
              <Text style={[styles.sourceText, { color: colors.textMuted }]}>
                {zikr.source}
              </Text>
            </View>
          ) : null}
        </View>
      )}

      {/* Bottom Counter & Next Row */}
      <View style={styles.bottomControlRow}>
        {/* Large Tactile Counter Tap Button */}
        <TouchableOpacity
          style={[
            styles.counterBigButton,
            {
              backgroundColor: isDone
                ? colors.success
                : colors.primary,
              shadowColor: isDone ? colors.success : colors.primary,
            },
          ]}
          onPress={handleTap}
          activeOpacity={0.8}
        >
          <View style={styles.counterInner}>
            <View style={styles.counterNumbersContainer}>
              <Text style={styles.counterCurrentText}>
                {toArabicNumerals(currentCount)}
              </Text>
              <Text style={styles.counterDividerText}>/</Text>
              <Text style={styles.counterTargetText}>
                {toArabicNumerals(zikr.count)}
              </Text>
            </View>

            <Text style={styles.counterButtonLabel}>
              {isDone ? 'تم بحمد الله' : 'ذَكَرْتُهُ'}
            </Text>
          </View>
          <Ionicons
            name={isDone ? 'checkmark-circle' : 'finger-print-outline'}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* Next Button */}
        {onNextPress && !isLast && (
          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.border,
              },
            ]}
            onPress={onNextPress}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-down" size={18} color={colors.textPrimary} />
            <Text style={[styles.nextButtonText, { color: colors.textPrimary }]}>
              التالي
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 3px 12px rgba(0,0,0,0.05)',
      },
    }),
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  indexBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indexNumberBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  indexNumberText: {
    fontSize: 12,
    fontWeight: '700',
  },
  targetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  targetBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginVertical: 8,
  },
  zikrText: {
    fontWeight: '600',
    textAlign: 'right',
    letterSpacing: 0.2,
  },
  fadlContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderRightWidth: 3.5,
  },
  fadlRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  fadlText: {
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
    textAlign: 'right',
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    justifyContent: 'flex-start',
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '500',
  },
  bottomControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  counterBigButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  counterInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterNumbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 3,
  },
  counterCurrentText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  counterDividerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
  },
  counterTargetText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  counterButtonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  nextButton: {
    height: 56,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  nextButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
