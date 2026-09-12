import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { AZKAR_ITEMS, CATEGORIES } from '../data/azkarData';
import { ZikrCard } from '../components/ZikrCard';
import { FontSizeModal } from '../components/FontSizeModal';
import { CategoryCompletedModal } from '../components/CategoryCompletedModal';
import { CategoryId, ZikrItem } from '../types';
import { toArabicNumerals } from '../utils/hijriDate';

interface ZikrListScreenProps {
  route: {
    params: {
      categoryId: CategoryId;
    };
  };
  navigation: any;
}

export const ZikrListScreen: React.FC<ZikrListScreenProps> = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const {
    colors,
    getCategoryProgress,
    resetCategory,
    getFavoriteZikrs,
    dailyProgress,
  } = useApp();

  const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);
  const [completedModalVisible, setCompletedModalVisible] = useState(false);
  const flatListRef = useRef<FlatList<ZikrItem>>(null);

  const categoryInfo = CATEGORIES.find((c) => c.id === categoryId);
  const isFavoritesCategory = categoryId === 'favorites';

  const title = isFavoritesCategory
    ? 'الأذكار المفضلة'
    : categoryInfo?.title || 'الأذكار';

  const subtitle = isFavoritesCategory
    ? 'أذكارك المختارة للرجوع السريع'
    : categoryInfo?.subtitle || '';

  const zikrs = isFavoritesCategory
    ? getFavoriteZikrs()
    : AZKAR_ITEMS.filter((item) => item.categoryId === categoryId);

  const progress = getCategoryProgress(categoryId);
  const isFullyCompleted = progress.percentage === 100 && progress.total > 0;

  // Detect when just completed full category
  const prevCompletedRef = useRef(false);
  useEffect(() => {
    if (isFullyCompleted && !prevCompletedRef.current) {
      setCompletedModalVisible(true);
    }
    prevCompletedRef.current = isFullyCompleted;
  }, [isFullyCompleted]);

  // Determine next category for quick chaining
  const nextCatIndex = CATEGORIES.findIndex((c) => c.id === categoryId) + 1;
  const nextCategory = nextCatIndex < CATEGORIES.length ? CATEGORIES[nextCatIndex] : null;

  const handleResetCategory = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('هل تريد إعادة تصفير عدادات هذا القسم؟')) {
        resetCategory(categoryId);
      }
    } else {
      Alert.alert(
        'إعادة ضبط العدادات',
        'هل تريد إعادة تصفير تقدم هذا القسم لليوم؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          {
            text: 'تصفير',
            style: 'destructive',
            onPress: () => resetCategory(categoryId),
          },
        ]
      );
    }
  };

  const handleNextZikr = (currentIndex: number) => {
    if (currentIndex + 1 < zikrs.length && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
        viewPosition: 0.1,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Custom Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
        <View style={styles.headerRow}>
          {/* Back Button */}
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.surfaceSubtle }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-forward" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Title & Subtitle */}
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>

          {/* Right actions: Font scale & Reset */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setFontSizeModalVisible(true)}
              activeOpacity={0.7}
              accessibilityLabel="تغيير حجم الخط"
            >
              <Ionicons name="text-outline" size={19} color={colors.textPrimary} />
            </TouchableOpacity>

            {progress.completed > 0 && (
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: colors.surfaceSubtle }]}
                onPress={handleResetCategory}
                activeOpacity={0.7}
                accessibilityLabel="تصفير أذكار هذا القسم"
              >
                <Ionicons name="refresh-outline" size={19} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Progress Strip */}
        <View style={styles.progressRow}>
          <View style={[styles.progressTrack, { backgroundColor: colors.surfaceSubtle }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress.percentage}%`,
                  backgroundColor: isFullyCompleted ? colors.success : colors.primary,
                },
              ]}
            />
          </View>

          <View style={styles.progressTextRow}>
            <Text style={[styles.progressCount, { color: colors.textSecondary }]}>
              أُنجز {toArabicNumerals(progress.completed)} من {toArabicNumerals(progress.total)}
            </Text>
            <Text
              style={[
                styles.progressPercent,
                { color: isFullyCompleted ? colors.success : colors.primary },
              ]}
            >
              {toArabicNumerals(progress.percentage)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Main Azkar List */}
      <FlatList
        ref={flatListRef}
        data={zikrs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ZikrCard
            zikr={item}
            index={index}
            totalInList={zikrs.length}
            isLast={index === zikrs.length - 1}
            onNextPress={() => handleNextZikr(index)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name={isFavoritesCategory ? 'star-outline' : 'book-outline'}
              size={52}
              color={colors.textMuted}
            />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              {isFavoritesCategory ? 'لا توجد أذكار مفضلة بعد' : 'لا توجد أذكار في هذا القسم'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              {isFavoritesCategory
                ? 'اضغط على رمز النجمة ⭐ في أي بطاقة ذكر لإضافتها إلى قائمة مفضلتك هنا.'
                : 'تأكد من اختيار قسم صحيح.'}
            </Text>

            {isFavoritesCategory && (
              <TouchableOpacity
                style={[styles.browseBtn, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('أذكار الصباح', { categoryId: 'morning' })}
              >
                <Text style={styles.browseBtnText}>تصفح أذكار الصباح</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        onScrollToIndexFailed={(info) => {
          // Handle scroll failure gracefully
          flatListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
      />

      {/* Font Size Modal */}
      <FontSizeModal
        visible={fontSizeModalVisible}
        onClose={() => setFontSizeModalVisible(false)}
      />

      {/* Completion Modal */}
      <CategoryCompletedModal
        visible={completedModalVisible}
        categoryTitle={title}
        onClose={() => setCompletedModalVisible(false)}
        onGoHome={() => navigation.navigate('الرئيسية')}
        onNextCategory={
          nextCategory
            ? () => {
                navigation.replace('ZikrList', { categoryId: nextCategory.id });
              }
            : undefined
        }
        nextCategoryTitle={nextCategory?.title}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRow: {
    marginTop: 10,
    gap: 4,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '800',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
  },
  browseBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 20,
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
