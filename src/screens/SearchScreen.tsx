import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { AZKAR_ITEMS, CATEGORIES } from '../data/azkarData';
import { ZikrCard } from '../components/ZikrCard';
import { CategoryId, ZikrItem } from '../types';
import { toArabicNumerals } from '../utils/hijriDate';

export const SearchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useApp();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');

  // Strip Arabic Tashkeel for smarter fuzzy searching
  const normalizeArabic = (text: string) => {
    return text
      .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
      .replace(/[أإآ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .toLowerCase();
  };

  const searchResults = useMemo(() => {
    let results = AZKAR_ITEMS;

    if (selectedCategory !== 'all') {
      results = results.filter((item) => item.categoryId === selectedCategory);
    }

    if (!query.trim()) {
      return results;
    }

    const normQuery = normalizeArabic(query.trim());

    return results.filter((item) => {
      const normText = normalizeArabic(item.text);
      const normFadl = item.fadl ? normalizeArabic(item.fadl) : '';
      const normSource = item.source ? normalizeArabic(item.source) : '';

      const cat = CATEGORIES.find((c) => c.id === item.categoryId);
      const normCatTitle = cat ? normalizeArabic(cat.title) : '';

      return (
        normText.includes(normQuery) ||
        normFadl.includes(normQuery) ||
        normSource.includes(normQuery) ||
        normCatTitle.includes(normQuery)
      );
    });
  }, [query, selectedCategory]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Search Input Bar */}
      <View style={[styles.searchHeader, { borderBottomColor: colors.borderLight }]}>
        <View style={styles.searchInputRow}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.surfaceSubtle }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-forward" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="search-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="ابحث بكلمات من الذكر، الفضل، أو القسم..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoFocus
              textAlign="right"
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Categories Chips */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: 'all', title: 'الكل' }, ...CATEGORIES]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedCategory(item.id as CategoryId | 'all')}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.filterChipsList}
        />
      </View>

      {/* Search Result Count */}
      <View style={styles.resultsInfoRow}>
        <Text style={[styles.resultsCountText, { color: colors.textMuted }]}>
          وجدنا {toArabicNumerals(searchResults.length)} نتيجة
        </Text>
      </View>

      {/* Results List */}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ZikrCard
            zikr={item}
            index={index}
            totalInList={searchResults.length}
            isLast={index === searchResults.length - 1}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceSubtle }]}>
              <Ionicons name="search-outline" size={44} color={colors.textMuted} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              لم نجد ما تبحث عنه
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              تأكد من كتابة الكلمات بشكل صحيح أو اختر قسماً آخر للتصفح.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  filterChipsList: {
    paddingVertical: 4,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  resultsInfoRow: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  resultsCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
  },
});
