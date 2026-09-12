import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { toArabicNumerals } from '../utils/hijriDate';

interface CategoryCompletedModalProps {
  visible: boolean;
  categoryTitle: string;
  onClose: () => void;
  onGoHome: () => void;
  onNextCategory?: () => void;
  nextCategoryTitle?: string;
}

export const CategoryCompletedModal: React.FC<CategoryCompletedModalProps> = ({
  visible,
  categoryTitle,
  onClose,
  onGoHome,
  onNextCategory,
  nextCategoryTitle,
}) => {
  const { colors } = useApp();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {/* Animated/Celebration Icon */}
          <View style={[styles.iconCircle, { backgroundColor: colors.successLight }]}>
            <Ionicons name="checkmark-done-circle" size={54} color={colors.success} />
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>
            تقبّل الله طاعتكم!
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            أتممت بحمد الله وتوفيقه جميع{' '}
            <Text style={{ fontWeight: '800', color: colors.primary }}>{categoryTitle}</Text>
          </Text>

          <View style={[styles.quoteBox, { backgroundColor: colors.surfaceSubtle }]}>
            <Ionicons name="sparkles" size={16} color={colors.accent} />
            <Text style={[styles.quoteText, { color: colors.textSecondary }]}>
              «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsColumn}>
            {onNextCategory && nextCategoryTitle ? (
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                onPress={() => {
                  onClose();
                  onNextCategory();
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>
                  الانتقال إلى {nextCategoryTitle}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[
                styles.secondaryBtn,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => {
                onClose();
                onGoHome();
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="home-outline" size={18} color={colors.textPrimary} />
              <Text style={[styles.secondaryBtnText, { color: colors.textPrimary }]}>
                العودة للرئيسية
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeTextBtn} onPress={onClose}>
              <Text style={[styles.closeText, { color: colors.textMuted }]}>
                البقاء ومراجعة الأذكار
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  quoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionsColumn: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  closeTextBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 13,
  },
});
