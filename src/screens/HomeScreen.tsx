import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { DailyWirdCard } from '../components/DailyWirdCard';
import { CATEGORIES, DAILY_HADITHS } from '../data/azkarData';
import { CategoryCard } from '../components/CategoryCard';
import { toArabicNumerals } from '../utils/hijriDate';
import { CategoryId } from '../types';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors, favorites, getCategoryProgress } = useApp();
  const [hadithIndex, setHadithIndex] = useState(0);

  const currentHadith = DAILY_HADITHS[hadithIndex % DAILY_HADITHS.length];

  const handleShareHadith = async () => {
    try {
      await Share.share({
        message: `${currentHadith.hadith}\n[${currentHadith.source}]\n\nعبر تطبيق "ذِكري"`,
      });
    } catch (e) {
      // Ignore
    }
  };

  const handleNextHadith = () => {
    setHadithIndex((prev) => (prev + 1) % DAILY_HADITHS.length);
  };

  const handleCategoryPress = (catId: CategoryId) => {
    if (catId === 'tasbeeh') {
      navigation.navigate('المسبحة');
    } else if (catId === 'favorites') {
      navigation.navigate('Favorites');
    } else {
      navigation.navigate('ZikrList', { categoryId: catId });
    }
  };

  const favProgress = getCategoryProgress('favorites');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        onSearchPress={() => navigation.navigate('Search')}
        onAchievementsPress={() => navigation.navigate('Achievements')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Wird Feature Card */}
        <DailyWirdCard
          onStartPress={() => navigation.navigate('ZikrList', { categoryId: 'morning' })}
        />

        {/* Quick Hadith of the Day */}
        <View
          style={[
            styles.hadithCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.cardShadow,
            },
          ]}
        >
          <View style={styles.hadithTopRow}>
            <View style={[styles.hadithBadge, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="sparkles" size={14} color={colors.accentDark} />
              <Text style={[styles.hadithBadgeText, { color: colors.accentDark }]}>
                حديث اليوم
              </Text>
            </View>

            <View style={styles.hadithActions}>
              <TouchableOpacity
                style={[styles.smallIconBtn, { backgroundColor: colors.surfaceSubtle }]}
                onPress={handleNextHadith}
                accessibilityLabel="حديث آخر"
              >
                <Ionicons name="shuffle-outline" size={16} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.smallIconBtn, { backgroundColor: colors.surfaceSubtle }]}
                onPress={handleShareHadith}
                accessibilityLabel="مشاركة الحديث"
              >
                <Ionicons name="share-social-outline" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.hadithText, { color: colors.textPrimary }]}>
            {currentHadith.hadith}
          </Text>

          <Text style={[styles.hadithSource, { color: colors.textMuted }]}>
            {currentHadith.source}
          </Text>
        </View>

        {/* Categories Section Header */}
        <View style={styles.sectionHeader}>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => navigation.navigate('الأذكار')}
          >
            <Text style={[styles.seeAllText, { color: colors.primary }]}>عرض الكل</Text>
            <Ionicons name="chevron-back" size={14} color={colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            الأقسام الرئيسية
          </Text>
        </View>

        {/* 2-Column Grid of 8 Sections as requested */}
        <View style={styles.gridWrapper}>
          {CATEGORIES.slice(0, 6).map((cat) => (
            <View key={cat.id} style={styles.gridItemHalf}>
              <CategoryCard
                category={cat}
                layout="grid"
                onPress={() => handleCategoryPress(cat.id)}
              />
            </View>
          ))}

          {/* 7. Digital Tasbeeh Section */}
          <View style={styles.gridItemHalf}>
            <TouchableOpacity
              style={[
                styles.specialGridCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  shadowColor: colors.cardShadow,
                },
              ]}
              onPress={() => navigation.navigate('المسبحة')}
              activeOpacity={0.8}
            >
              <View style={styles.specialCardTop}>
                <View
                  style={[styles.specialIconBadge, { backgroundColor: colors.primaryLight }]}
                >
                  <Ionicons name="radio-button-on" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.specialPill, { color: colors.primary }]}>تسبيح</Text>
              </View>
              <Text style={[styles.specialTitle, { color: colors.textPrimary }]}>
                المسبحة الإلكترونية
              </Text>
              <Text style={[styles.specialSubtitle, { color: colors.textMuted }]}>
                عداد ذكي ومرن
              </Text>
            </TouchableOpacity>
          </View>

          {/* 8. Favorites Section */}
          <View style={styles.gridItemHalf}>
            <TouchableOpacity
              style={[
                styles.specialGridCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  shadowColor: colors.cardShadow,
                },
              ]}
              onPress={() => navigation.navigate('Favorites')}
              activeOpacity={0.8}
            >
              <View style={styles.specialCardTop}>
                <View
                  style={[styles.specialIconBadge, { backgroundColor: colors.accentLight }]}
                >
                  <Ionicons name="star" size={24} color={colors.accent} />
                </View>
                <Text style={[styles.specialPill, { color: colors.accentDark }]}>
                  {toArabicNumerals(favorites.length)} أذكار
                </Text>
              </View>
              <Text style={[styles.specialTitle, { color: colors.textPrimary }]}>
                الأذكار المفضلة
              </Text>
              <Text style={[styles.specialSubtitle, { color: colors.textMuted }]}>
                أذكارك المختارة
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Achievements Summary Banner */}
        <TouchableOpacity
          style={[
            styles.achieveBanner,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => navigation.navigate('Achievements')}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
          <View style={styles.achieveBannerText}>
            <Text style={[styles.achieveBannerTitle, { color: colors.textPrimary }]}>
              لوحة إنجازاتي اليومية
            </Text>
            <Text style={[styles.achieveBannerSub, { color: colors.textMuted }]}>
              تابع إحصائياتك وأوسمة الالتزام بذكر الله
            </Text>
          </View>
          <View
            style={[styles.achieveBannerIcon, { backgroundColor: colors.accentLight }]}
          >
            <Ionicons name="trophy" size={22} color={colors.accentDark} />
          </View>
        </TouchableOpacity>

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
  hadithCard: {
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
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
  hadithTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  hadithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hadithBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  hadithActions: {
    flexDirection: 'row',
    gap: 6,
  },
  smallIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hadithText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'right',
  },
  hadithSource: {
    fontSize: 11,
    textAlign: 'left',
    marginTop: 8,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
  },
  gridItemHalf: {
    width: '48.5%',
  },
  specialGridCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
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
  specialCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  specialIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialPill: {
    fontSize: 12,
    fontWeight: '700',
  },
  specialTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  specialSubtitle: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 2,
    marginBottom: 6,
  },
  achieveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 18,
    borderWidth: 1,
  },
  achieveBannerIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achieveBannerText: {
    flex: 1,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
  },
  achieveBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  achieveBannerSub: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 2,
  },
});
