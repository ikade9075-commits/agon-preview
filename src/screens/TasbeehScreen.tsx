import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { CustomTasbeehModal } from '../components/CustomTasbeehModal';
import { toArabicNumerals } from '../utils/hijriDate';

const TARGET_PRESETS = [33, 70, 100, 500, 1000, 0];

export const TasbeehScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    colors,
    tasbeehList,
    activeTasbeeh,
    setActiveTasbeehId,
    incrementTasbeeh,
    resetActiveTasbeeh,
    setActiveTasbeehTarget,
    deleteCustomTasbeeh,
    userStats,
    dailyProgress,
  } = useApp();

  const [dhikrSelectorVisible, setDhikrSelectorVisible] = useState(false);
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

  const target = activeTasbeeh.target || 0;
  const count = activeTasbeeh.count || 0;
  const progressPercent = target > 0 ? Math.min(Math.round((count / target) * 100), 100) : 0;
  const isGoalReached = target > 0 && count >= target;

  const handleReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('هل تريد تصفير عداد هذا الذكر؟')) {
        resetActiveTasbeeh();
      }
    } else {
      Alert.alert('تصفير المسبحة', 'هل تريد إعادة ضبط عداد هذا الذكر إلى الصفر؟', [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تصفير', style: 'destructive', onPress: resetActiveTasbeeh },
      ]);
    }
  };

  const handleDelete = (id: string, text: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`هل تريد حذف الذكر "${text}"؟`)) {
        deleteCustomTasbeeh(id);
      }
    } else {
      Alert.alert('حذف الذكر', `هل أنت متأكد من حذف "${text}"؟`, [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف', style: 'destructive', onPress: () => deleteCustomTasbeeh(id) },
      ]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="المسبحة الإلكترونية"
        subtitle="ألا بذكر الله تطمئن القلوب"
        onAchievementsPress={() => navigation.navigate('Achievements')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Dhikr Selector Card */}
        <TouchableOpacity
          style={[
            styles.dhikrSelectorCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => setDhikrSelectorVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.dhikrSelectorTop}>
            <View style={[styles.targetBadge, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="flag-outline" size={13} color={colors.accentDark} />
              <Text style={[styles.targetBadgeText, { color: colors.accentDark }]}>
                {target === 0 ? 'الهدف: مفتوح' : `الهدف: ${toArabicNumerals(target)}`}
              </Text>
            </View>

            <View style={styles.dhikrChangeAction}>
              <Text style={[styles.dhikrChangeText, { color: colors.primary }]}>تغيير الذكر</Text>
              <Ionicons name="swap-horizontal" size={16} color={colors.primary} />
            </View>
          </View>

          <Text style={[styles.activeDhikrText, { color: colors.textPrimary }]} numberOfLines={2}>
            {activeTasbeeh.text}
          </Text>

          {activeTasbeeh.meaning ? (
            <Text style={[styles.activeDhikrMeaning, { color: colors.textMuted }]} numberOfLines={1}>
              {activeTasbeeh.meaning}
            </Text>
          ) : null}
        </TouchableOpacity>

        {/* Large Central Tasbeeh Counter Circle */}
        <View style={styles.counterSection}>
          <TouchableOpacity
            style={[
              styles.largeTapCircle,
              {
                backgroundColor: isGoalReached ? colors.success : colors.primary,
                borderColor: isPressing
                  ? colors.accent
                  : isGoalReached
                  ? colors.successLight
                  : colors.primaryLight,
                transform: [{ scale: isPressing ? 0.95 : 1 }],
              },
            ]}
            onPress={incrementTasbeeh}
            onPressIn={() => setIsPressing(true)}
            onPressOut={() => setIsPressing(false)}
            activeOpacity={0.9}
          >
            {/* Inner Ring Glow */}
            <View
              style={[
                styles.innerRing,
                {
                  borderColor: 'rgba(255,255,255,0.25)',
                },
              ]}
            >
              <Text style={styles.countNumberText}>{toArabicNumerals(count)}</Text>
              <Text style={styles.tapPromptText}>
                {isGoalReached ? '✨ اكتمل الهدف ✨' : 'اضغط للتسبيح'}
              </Text>

              {target > 0 && (
                <View style={styles.ringProgressBadge}>
                  <Text style={styles.ringProgressText}>
                    {toArabicNumerals(progressPercent)}%
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Action Controls Bar (Reset, Goal, Add Custom) */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[
              styles.controlBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={20} color={colors.danger} />
            <Text style={[styles.controlBtnText, { color: colors.danger }]}>تصفير</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => setTargetModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="locate-outline" size={20} color={colors.primary} />
            <Text style={[styles.controlBtnText, { color: colors.primary }]}>تحديد الهدف</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => setCustomModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.accentDark} />
            <Text style={[styles.controlBtnText, { color: colors.accentDark }]}>إضافة ذكر</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Strip */}
        <View
          style={[
            styles.statsStrip,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.statCol}>
            <Text style={[styles.statNum, { color: colors.primary }]}>
              {toArabicNumerals(dailyProgress.tasbeehCountToday)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>تسبيحات اليوم</Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

          <View style={styles.statCol}>
            <Text style={[styles.statNum, { color: colors.accentDark }]}>
              {toArabicNumerals(activeTasbeeh.totalCount || count)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>إجمالي هذا الذكر</Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

          <View style={styles.statCol}>
            <Text style={[styles.statNum, { color: colors.textPrimary }]}>
              {toArabicNumerals(userStats.totalTasbeehCompleted)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>الرصيد الكلي</Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Dhikr Selector Modal */}
      <Modal
        visible={dhikrSelectorVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDhikrSelectorVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={[styles.closeIconBtn, { backgroundColor: colors.surfaceSubtle }]}
                onPress={() => setDhikrSelectorVisible(false)}
              >
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.modalSheetTitle, { color: colors.textPrimary }]}>
                اختر صيغة الذكر
              </Text>
            </View>

            <ScrollView style={styles.dhikrListScroll} showsVerticalScrollIndicator={false}>
              {tasbeehList.map((item) => {
                const isSelected = item.id === activeTasbeeh.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.dhikrOptionRow,
                      {
                        backgroundColor: isSelected ? colors.primaryLight : colors.surfaceSubtle,
                        borderColor: isSelected ? colors.primary : 'transparent',
                      },
                    ]}
                    onPress={() => {
                      setActiveTasbeehId(item.id);
                      setDhikrSelectorVisible(false);
                    }}
                  >
                    {item.isCustom ? (
                      <TouchableOpacity
                        onPress={() => handleDelete(item.id, item.text)}
                        style={styles.deleteBtn}
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.danger} />
                      </TouchableOpacity>
                    ) : (
                      <View style={{ width: 24 }} />
                    )}

                    <View style={styles.dhikrOptionTextCol}>
                      <Text
                        style={[
                          styles.dhikrOptionTitle,
                          { color: isSelected ? colors.primary : colors.textPrimary },
                        ]}
                      >
                        {item.text}
                      </Text>
                      {item.fadl ? (
                        <Text
                          style={[styles.dhikrOptionFadl, { color: colors.textMuted }]}
                          numberOfLines={1}
                        >
                          {item.fadl}
                        </Text>
                      ) : null}
                    </View>

                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={[styles.addDhikrModalBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                setDhikrSelectorVisible(false);
                setCustomModalVisible(true);
              }}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addDhikrModalBtnText}>إضافة صيغة ذكر جديدة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Target Selector Modal */}
      <Modal
        visible={targetModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTargetModalVisible(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View
            style={[
              styles.targetDialog,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={[styles.closeIconBtn, { backgroundColor: colors.surfaceSubtle }]}
                onPress={() => setTargetModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.modalSheetTitle, { color: colors.textPrimary }]}>
                تحديد الهدف للتسبيح
              </Text>
            </View>

            <View style={styles.targetGrid}>
              {TARGET_PRESETS.map((t) => {
                const isSelected = target === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.targetGridItem,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => {
                      setActiveTasbeehTarget(t);
                      setTargetModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.targetGridText,
                        { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      {t === 0 ? 'مفتوح (∞)' : toArabicNumerals(t)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Custom Dhikr Modal */}
      <CustomTasbeehModal
        visible={customModalVisible}
        onClose={() => setCustomModalVisible(false)}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = Math.min(width * 0.72, 270);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  dhikrSelectorCard: {
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
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
  dhikrSelectorTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  targetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  targetBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dhikrChangeAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dhikrChangeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  activeDhikrText: {
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'right',
    lineHeight: 28,
  },
  activeDhikrMeaning: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  counterSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  largeTapCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 24px rgba(15, 104, 72, 0.3)',
      },
    }),
  },
  innerRing: {
    width: CIRCLE_SIZE - 28,
    height: CIRCLE_SIZE - 28,
    borderRadius: (CIRCLE_SIZE - 28) / 2,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countNumberText: {
    color: '#FFFFFF',
    fontSize: 54,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tapPromptText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  ringProgressBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ringProgressText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  controlBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  controlBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  statsStrip: {
    flexDirection: 'row',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalSheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    maxHeight: '80%',
    borderWidth: 1,
  },
  targetDialog: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalSheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'right',
  },
  closeIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dhikrListScroll: {
    maxHeight: 340,
  },
  dhikrOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 8,
    gap: 8,
  },
  dhikrOptionTextCol: {
    flex: 1,
  },
  dhikrOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  dhikrOptionFadl: {
    fontSize: 11,
    textAlign: 'right',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 4,
  },
  addDhikrModalBtn: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  addDhikrModalBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  targetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  targetGridItem: {
    width: '30%',
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetGridText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
