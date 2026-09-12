import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { toArabicNumerals } from '../utils/hijriDate';

interface CustomTasbeehModalProps {
  visible: boolean;
  onClose: () => void;
}

const PRESET_TARGETS = [33, 70, 100, 500, 1000, 0];

export const CustomTasbeehModal: React.FC<CustomTasbeehModalProps> = ({ visible, onClose }) => {
  const { colors, addCustomTasbeeh } = useApp();
  const [text, setText] = useState('');
  const [meaning, setMeaning] = useState('');
  const [selectedTarget, setSelectedTarget] = useState(33);
  const [customTargetInput, setCustomTargetInput] = useState('');

  const handleSave = () => {
    if (!text.trim()) return;
    const finalTarget = customTargetInput ? parseInt(customTargetInput, 10) || 33 : selectedTarget;
    addCustomTasbeeh(text.trim(), finalTarget, meaning.trim() || undefined);
    setText('');
    setMeaning('');
    setCustomTargetInput('');
    setSelectedTarget(33);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View
          style={[
            styles.contentCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.surfaceSubtle }]}
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              إضافة ذكر مخصص للمسبحة
            </Text>
          </View>

          {/* Input text */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>نص الذكر *</Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="مثال: لا إله إلا أنت سبحانك إني كنت من الظالمين"
              placeholderTextColor={colors.textMuted}
              value={text}
              onChangeText={setText}
              textAlign="right"
            />
          </View>

          {/* Meaning or virtue (optional) */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              ملاحظة أو فضل الذكر (اختياري)
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="مثال: دعاء ذي النون لتفريج الكروب"
              placeholderTextColor={colors.textMuted}
              value={meaning}
              onChangeText={setMeaning}
              textAlign="right"
            />
          </View>

          {/* Target count presets */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>العدد المستهدف</Text>
            <View style={styles.targetPresetsRow}>
              {PRESET_TARGETS.map((t) => {
                const isSelected = selectedTarget === t && !customTargetInput;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.targetChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => {
                      setSelectedTarget(t);
                      setCustomTargetInput('');
                    }}
                  >
                    <Text
                      style={[
                        styles.targetChipText,
                        { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      {t === 0 ? 'مفتوح ∞' : toArabicNumerals(t)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: text.trim() ? colors.primary : colors.surfaceSubtle },
              ]}
              onPress={handleSave}
              disabled={!text.trim()}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.saveButtonText,
                  { color: text.trim() ? '#FFFFFF' : colors.textMuted },
                ]}
              >
                إضافة الذكر
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  contentCard: {
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
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 6,
  },
  textInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  targetPresetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  targetChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 50,
    alignItems: 'center',
  },
  targetChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  saveButton: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
