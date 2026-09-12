import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { FontSizeOption } from '../types';
import { getZikrFontSize, getZikrLineHeight } from '../theme/typography';

interface FontSizeModalProps {
  visible: boolean;
  onClose: () => void;
}

const SIZES: { key: FontSizeOption; label: string; desc: string }[] = [
  { key: 'small', label: 'صغير', desc: 'مناسب للشاشات الصغيرة' },
  { key: 'normal', label: 'متوسط (الافتراضي)', desc: 'مريح ومناسب للقراءة اليومية' },
  { key: 'large', label: 'كبير', desc: 'خط مكبر وواضح جداً' },
  { key: 'xlarge', label: 'كبير جداً', desc: 'أكبر حجم لتسهيل القراءة' },
];

export const FontSizeModal: React.FC<FontSizeModalProps> = ({ visible, onClose }) => {
  const { colors, fontSize, setFontSize } = useApp();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              تغيير حجم خط الأذكار
            </Text>
          </View>

          {/* Live Preview Box */}
          <View
            style={[
              styles.previewBox,
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.previewLabel, { color: colors.textMuted }]}>معاينة حية للخط:</Text>
            <Text
              style={[
                styles.previewText,
                {
                  color: colors.textPrimary,
                  fontSize: getZikrFontSize(fontSize),
                  lineHeight: getZikrLineHeight(fontSize),
                },
              ]}
            >
              ﴿اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ﴾
            </Text>
          </View>

          {/* Size Options */}
          <View style={styles.optionsList}>
            {SIZES.map((option) => {
              const isSelected = fontSize === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sizeOptionRow,
                    {
                      backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setFontSize(option.key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.sizeTextCol}>
                    <Text
                      style={[
                        styles.sizeLabel,
                        { color: isSelected ? colors.primary : colors.textPrimary },
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={[styles.sizeDesc, { color: colors.textMuted }]}>
                      {option.desc}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected ? colors.primary : 'transparent',
                      },
                    ]}
                  >
                    {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: colors.primary }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.doneButtonText}>حفظ وإغلاق</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'right',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBox: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  previewText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  optionsList: {
    gap: 10,
    marginBottom: 18,
  },
  sizeOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  sizeTextCol: {
    flex: 1,
  },
  sizeLabel: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  sizeDesc: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 2,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  doneButton: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
