import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface CreateOption {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface CreateOptionsModalProps {
  visible: boolean;
  onSelect: (optionId: string) => void;
  onCancel: () => void;
}

export const CreateOptionsModal: React.FC<CreateOptionsModalProps> = ({
  visible,
  onSelect,
  onCancel,
}) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const options: CreateOption[] = [
    {
      id: 'note',
      icon: '📝',
      title: 'New Note',
      description: 'Create a note with text and drawings',
      color: '#007AFF',
    },
    {
      id: 'notebook',
      icon: '📁',
      title: 'New Notebook',
      description: 'Organize notes in a notebook',
      color: '#34C759',
    },
    {
      id: 'sub-notebook',
      icon: '📂',
      title: 'New Sub-Notebook',
      description: 'Create a notebook inside another',
      color: '#FF9500',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <View style={styles.modalContainer}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.background }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              What would you like to create?
            </Text>

            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.option, { backgroundColor: theme.surface }]}
                onPress={() => {
                  onSelect(option.id);
                  onCancel();
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.optionIcon,
                    { backgroundColor: option.color },
                  ]}
                >
                  <Text style={styles.optionIconText}>{option.icon}</Text>
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, { color: theme.text }]}>
                    {option.title}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {option.description}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: theme.border }]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
  },
  modalContent: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  optionIconText: {
    fontSize: 24,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: typography.fontSize.sm,
  },
  chevron: {
    fontSize: 20,
    fontWeight: '300',
    color: '#8E8E93',
  },
  cancelButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
});
