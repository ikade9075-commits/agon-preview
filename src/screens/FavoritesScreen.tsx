import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { ZikrCard } from '../components/ZikrCard';
import { FontSizeModal } from '../components/FontSizeModal';
import { toArabicNumerals } from '../utils/hijriDate';

export const FavoritesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, getFavoriteZikrs } = useApp();
  const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);

  const favoriteItems = getFavoriteZikrs();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="الأذكار المفضلة"
        subtitle={`${toArabicNumerals(favoriteItems.length)} أذكار محفوظة`}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={favoriteItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ZikrCard
            zikr={item}
            index={index}
            totalInList={favoriteItems.length}
            isLast={index === favoriteItems.length - 1}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="star-outline" size={44} color={colors.accent} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              لا توجد أذكار في المفضلة بعد
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              يمكنك إضافة أي ذِكر إلى هذه القائمة بالضغط على رمز النجمة ⭐ في بطاقة الذكر لتسهيل الوصول إليه في أي وقت.
            </Text>

            <TouchableOpacity
              style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('ZikrList', { categoryId: 'morning' })}
              activeOpacity={0.8}
            >
              <Ionicons name="book-outline" size={18} color="#FFFFFF" />
              <Text style={styles.exploreBtnText}>استكشاف أذكار الصباح والمساء</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <FontSizeModal
        visible={fontSizeModalVisible}
        onClose={() => setFontSizeModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
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
    maxWidth: 300,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 22,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
