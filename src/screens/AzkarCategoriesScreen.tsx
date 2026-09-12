import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { CATEGORIES } from '../data/azkarData';
import { CategoryCard } from '../components/CategoryCard';
import { CategoryId } from '../types';

interface AzkarCategoriesScreenProps {
  navigation: any;
}

type FilterTab = 'all' | 'essential' | 'daily' | 'supplications';

export const AzkarCategoriesScreen: React.FC<AzkarCategoriesScreenProps> = ({ navigation }) => {
  const { colors } = useApp();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterCategories = () => {
    let list = CATEGORIES;

    if (activeTab === 'essential') {
      list = list.filter((c) => ['morning', 'evening', 'after_prayer'].includes(c.id));
    } else if (activeTab === 'daily') {
      list = list.filter((c) => ['sleep', 'waking_up', 'after_prayer'].includes(c.id));
    } else if (activeTab === 'supplications') {
      list = list.filter((c) => ['misc'].includes(c.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const filtered = filterCategories();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="أقسام الأذكار"
        subtitle="حصّن نفسك بأذكار اليوم والليلة"
        onSearchPress={() => navigation.navigate('Search')}
      />

      {/* Quick Search Bar */}
      <View style={styles.searchBarWrapper}>
        <TouchableOpacity
          style={[
            styles.searchBarInner,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.9}
        >
          <Ionicons name="search-outline" size={20} color={colors.textMuted} />
          <Text style={[styles.searchPlaceholder, { color: colors.textMuted }]}>
            ابحث في الأذكار أو الأقسام أو الأدعية...
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsList}
        >
          {[
            { id: 'all', label: 'جميع الأقسام' },
            { id: 'essential', label: 'الورد الأساسي' },
            { id: 'daily', label: 'أذكار اليوم' },
            { id: 'supplications', label: 'أدعية متنوعة' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setActiveTab(tab.id as FilterTab)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Category List */}
      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            layout="list"
            onPress={() => navigation.navigate('ZikrList', { categoryId: cat.id })}
          />
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              لم نجد ما تبحث عنه
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              جرّب البحث بكلمات أخرى أو تصفح الأقسام الرئيسية
            </Text>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  searchPlaceholder: {
    fontSize: 13,
    flex: 1,
    textAlign: 'right',
  },
  filterTabsWrapper: {
    paddingVertical: 6,
  },
  filterTabsList: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  listContainer: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
});
