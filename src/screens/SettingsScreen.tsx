import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Share,
  Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { FontSizeModal } from '../components/FontSizeModal';
import { ThemeMode } from '../types';
import { toArabicNumerals } from '../utils/hijriDate';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    colors,
    isDark,
    themeMode,
    setThemeMode,
    fontSize,
    settings,
    updateSettings,
    toggleReminder,
    updateReminderTime,
    resetAllStats,
  } = useApp();

  const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState<{ id: string; title: string; time: string } | null>(null);

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          'حمّل تطبيق "ذِكري" - رفيقك اليومي لأذكار الصباح والمساء والمسبحة الإلكترونية بتصميم هادئ ومريح وبدون إعلانات مزعجة.',
        title: 'تطبيق ذِكري',
      });
    } catch (e) {
      // Ignore
    }
  };

  const handleResetData = () => {
    const doReset = async () => {
      await resetAllStats();
      if (Platform.OS === 'web') {
        alert('تمت إعادة ضبط جميع البيانات بنجاح.');
      } else {
        Alert.alert('تم بنجاح', 'تمت إعادة ضبط الإحصائيات وسجلات الأذكار.');
      }
    };

    if (Platform.OS === 'web') {
      if (
        window.confirm(
          'تحذير: هل أنت متأكد من رغبتك في إعادة ضبط جميع الإحصائيات والأذكار المفضلة؟'
        )
      ) {
        doReset();
      }
    } else {
      Alert.alert(
        'إعادة ضبط البيانات',
        'سيتم تصفير جميع الإحصائيات، الأوسمة، والأذكار المفضلة. هل أنت متأكد؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          { text: 'إعادة ضبط', style: 'destructive', onPress: doReset },
        ]
      );
    }
  };

  const getFontSizeArabicName = (s: string) => {
    switch (s) {
      case 'small':
        return 'صغير';
      case 'normal':
        return 'متوسط (الافتراضي)';
      case 'large':
        return 'كبير';
      case 'xlarge':
        return 'كبير جداً';
      default:
        return 'متوسط';
    }
  };

  const PRESET_TIMES = [
    '05:00',
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="الإعدادات والتخصيص" subtitle="تخصيص الواجهة والإشعارات" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section: Appearance & Display */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>المظهر والعرض</Text>
        </View>

        <View
          style={[
            styles.cardGroup,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {/* Theme Selector */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                الوضع المظلم / الفاتح
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                اختر النمط المناسب لراحة عينيك
              </Text>
            </View>

            <View style={styles.themeToggleRow}>
              {[
                { mode: 'light' as ThemeMode, icon: 'sunny-outline', label: 'فاتح' },
                { mode: 'dark' as ThemeMode, icon: 'moon-outline', label: 'داكن' },
                { mode: 'system' as ThemeMode, icon: 'phone-portrait-outline', label: 'تلقائي' },
              ].map((t) => {
                const isSelected = themeMode === t.mode;
                return (
                  <TouchableOpacity
                    key={t.mode}
                    style={[
                      styles.themeBtn,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setThemeMode(t.mode)}
                  >
                    <Ionicons
                      name={t.icon as any}
                      size={14}
                      color={isSelected ? '#FFFFFF' : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.themeBtnText,
                        { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                      ]}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Font Size */}
          <TouchableOpacity
            style={styles.settingItemTouchable}
            onPress={() => setFontSizeModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
            <View style={styles.settingValueRow}>
              <Text style={[styles.settingValueText, { color: colors.primary }]}>
                {getFontSizeArabicName(fontSize)}
              </Text>
              <View style={styles.settingTextCol}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                  حجم خط نصوص الأذكار
                </Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                  تعديل حجم الخط لسهولة القراءة
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section: Interactions & Feedback */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>التفاعل والصوت</Text>
        </View>

        <View
          style={[
            styles.cardGroup,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {/* Haptic Vibration */}
          <View style={styles.settingItem}>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(val) => updateSettings({ vibrationEnabled: val })}
              trackColor={{ false: colors.surfaceSubtle, true: colors.primaryLight }}
              thumbColor={settings.vibrationEnabled ? colors.primary : '#ccc'}
            />
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                الاهتزاز التفاعلي (Haptics)
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                نبض خفيف عند الضغط على العداد وإتمام الذكر
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Audio Click */}
          <View style={styles.settingItem}>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(val) => updateSettings({ soundEnabled: val })}
              trackColor={{ false: colors.surfaceSubtle, true: colors.primaryLight }}
              thumbColor={settings.soundEnabled ? colors.primary : '#ccc'}
            />
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                صوت النقرات الهادئ
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                نغمة ناعمة عند النقر ونغمة خاصة عند الإتمام
              </Text>
            </View>
          </View>
        </View>

        {/* Section: Reminders / Notifications */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            التذكيرات والإشعارات
          </Text>
        </View>

        <View
          style={[
            styles.cardGroup,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {settings.reminders.map((rem, idx) => (
            <React.Fragment key={rem.id}>
              <View style={styles.reminderRow}>
                <Switch
                  value={rem.enabled}
                  onValueChange={() => toggleReminder(rem.id)}
                  trackColor={{ false: colors.surfaceSubtle, true: colors.primaryLight }}
                  thumbColor={rem.enabled ? colors.primary : '#ccc'}
                />

                <View style={styles.reminderCenterCol}>
                  <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                    {rem.title}
                  </Text>
                  <TouchableOpacity
                    style={[styles.timeBadge, { backgroundColor: colors.surfaceSubtle }]}
                    onPress={() => setTimePickerTarget(rem)}
                  >
                    <Ionicons name="time-outline" size={13} color={colors.primary} />
                    <Text style={[styles.timeBadgeText, { color: colors.primary }]}>
                      الوقت: {toArabicNumerals(rem.time)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {idx < settings.reminders.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Section: Data & About */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>التطبيق والبيانات</Text>
        </View>

        <View
          style={[
            styles.cardGroup,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {/* Share App */}
          <TouchableOpacity
            style={styles.settingItemTouchable}
            onPress={handleShareApp}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
            <View style={styles.settingIconRow}>
              <View style={styles.settingTextCol}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                  مشاركة التطبيق
                </Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                  انشر الخير ولك مثل أجر الفاعلين
                </Text>
              </View>
              <View style={[styles.itemIconCircle, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="share-social" size={18} color={colors.primary} />
              </View>
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* About App */}
          <TouchableOpacity
            style={styles.settingItemTouchable}
            onPress={() => setAboutModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
            <View style={styles.settingIconRow}>
              <View style={styles.settingTextCol}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>عن تطبيق ذِكري</Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                  المصادر الموثوقة والرؤية
                </Text>
              </View>
              <View style={[styles.itemIconCircle, { backgroundColor: colors.accentLight }]}>
                <Ionicons name="information" size={18} color={colors.accentDark} />
              </View>
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Privacy */}
          <TouchableOpacity
            style={styles.settingItemTouchable}
            onPress={() => setPrivacyModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
            <View style={styles.settingIconRow}>
              <View style={styles.settingTextCol}>
                <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                  الخصوصية والأمان
                </Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                  بدون تتبع، بياناتك محفوظة على هاتفك فقط
                </Text>
              </View>
              <View style={[styles.itemIconCircle, { backgroundColor: colors.surfaceSubtle }]}>
                <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
              </View>
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Reset Stats */}
          <TouchableOpacity
            style={styles.settingItemTouchable}
            onPress={handleResetData}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={18} color={colors.danger} />
            <View style={styles.settingIconRow}>
              <View style={styles.settingTextCol}>
                <Text style={[styles.settingTitle, { color: colors.danger }]}>
                  إعادة ضبط الإحصائيات
                </Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                  تصفير سجلات الإنجاز والمفضلة والبدء من جديد
                </Text>
              </View>
              <View style={[styles.itemIconCircle, { backgroundColor: colors.dangerLight }]}>
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Version info footer */}
        <View style={styles.versionFooter}>
          <Text style={[styles.versionText, { color: colors.textMuted }]}>
            تطبيق ذِكري • الإصدار ١.٠.٠ (٢٠٢٦)
          </Text>
          <Text style={[styles.subVersionText, { color: colors.textMuted }]}>
            صُنع بعناية ليكون رفيقك الدائم لذكر الله
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Font Size Modal */}
      <FontSizeModal
        visible={fontSizeModalVisible}
        onClose={() => setFontSizeModalVisible(false)}
      />

      {/* Time Picker Modal */}
      <Modal
        visible={!!timePickerTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setTimePickerTarget(null)}
      >
        <View style={styles.overlayCenter}>
          <View
            style={[
              styles.timeModalCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.timeModalTitle, { color: colors.textPrimary }]}>
              {timePickerTarget?.title}
            </Text>
            <Text style={[styles.timeModalSubtitle, { color: colors.textMuted }]}>
              اختر وقت التذكير المناسب لك
            </Text>

            <View style={styles.timeGrid}>
              {PRESET_TIMES.map((time) => {
                const isSelected = timePickerTarget?.time === time;
                return (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => {
                      if (timePickerTarget) {
                        updateReminderTime(timePickerTarget.id, time);
                        setTimePickerTarget(null);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.timeChipText,
                        { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      {toArabicNumerals(time)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.closeTimeBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={() => setTimePickerTarget(null)}
            >
              <Text style={[styles.closeTimeBtnText, { color: colors.textPrimary }]}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={aboutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <View style={styles.overlayCenter}>
          <View
            style={[
              styles.infoModalCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={[styles.infoLogoBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="book" size={32} color={colors.primary} />
            </View>

            <Text style={[styles.infoModalTitle, { color: colors.textPrimary }]}>
              عن تطبيق ذِكري
            </Text>
            <Text style={[styles.infoModalDesc, { color: colors.textSecondary }]}>
              «ذِكري» هو تطبيق إسلامي عصري صُمم ليعينك على المحافظة على وردك اليومي من أذكار الصباح والمساء، وأذكار ما بعد الصلاة والنوم والاستيقاظ، بالإضافة إلى مسبحة إلكترونية ذكية ولوحة إنجازات حقيقية.
            </Text>

            <View style={[styles.sourcesBox, { backgroundColor: colors.surfaceSubtle }]}>
              <Text style={[styles.sourcesHeader, { color: colors.textPrimary }]}>
                📚 توثيق الأذكار وصحتها:
              </Text>
              <Text style={[styles.sourcesText, { color: colors.textSecondary }]}>
                جميع نصوص الأذكار والأدعية الواردة في التطبيق مأخوذة من المصادر المعتمدة: صحيح البخاري، صحيح مسلم، سنن أبي داود، سنن الترمذي، وكتاب حصن المسلم، مع ذكر مصدر وتخريج كل ذكر بدقة وأمانة علمية.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.modalOkBtn, { backgroundColor: colors.primary }]}
              onPress={() => setAboutModalVisible(false)}
            >
              <Text style={styles.modalOkBtnText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        visible={privacyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.overlayCenter}>
          <View
            style={[
              styles.infoModalCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={[styles.infoLogoBadge, { backgroundColor: colors.successLight }]}>
              <Ionicons name="shield-checkmark" size={32} color={colors.success} />
            </View>

            <Text style={[styles.infoModalTitle, { color: colors.textPrimary }]}>
              الخصوصية والأمان
            </Text>

            <Text style={[styles.infoModalDesc, { color: colors.textSecondary }]}>
              نحن نؤمن بأن العبادة والأذكار مسألة خاصة جداً بين العبد وربه:
              {'\n\n'}
              • التطبيق يعمل بشكل كامل محلياً (Offline First).
              {'\n'}
              • لا نقوم بجمع أو مشاركة أي بيانات شخصية أو إحصائيات مع أي طرف خارجي.
              {'\n'}
              • جميع إحصائياتك وأذكارك المفضلة مخزنة بأمان على ذاكرة جهازك فقط.
            </Text>

            <TouchableOpacity
              style={[styles.modalOkBtn, { backgroundColor: colors.primary }]}
              onPress={() => setPrivacyModalVisible(false)}
            >
              <Text style={styles.modalOkBtnText}>حسناً، فهمت</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  sectionHeader: {
    paddingHorizontal: 18,
    marginTop: 18,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardGroup: {
    borderRadius: 20,
    marginHorizontal: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingItemTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingTextCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  settingDesc: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 2,
  },
  settingValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'flex-end',
  },
  settingValueText: {
    fontSize: 13,
    fontWeight: '700',
  },
  settingIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'flex-end',
  },
  itemIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  themeBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  reminderCenterCol: {
    alignItems: 'flex-end',
    flex: 1,
    marginRight: 12,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  versionFooter: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  subVersionText: {
    fontSize: 11,
    marginTop: 4,
  },
  overlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timeModalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  timeModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  timeModalSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 70,
    alignItems: 'center',
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  closeTimeBtn: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeTimeBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoModalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    alignItems: 'center',
  },
  infoLogoBadge: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  infoModalTitle: {
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoModalDesc: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: 14,
  },
  sourcesBox: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    width: '100%',
  },
  sourcesHeader: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 4,
  },
  sourcesText: {
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'right',
  },
  modalOkBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOkBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
