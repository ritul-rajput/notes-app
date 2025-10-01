import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { NotebookTreeNode } from '../../types/notebook';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface LocationPickerModalProps {
  visible: boolean;
  notebooks: NotebookTreeNode[];
  title: string;
  onSelect: (notebookId: string | null) => void;
  onCancel: () => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  notebooks,
  title,
  onSelect,
  onCancel,
}) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const renderNotebookOption = (notebook: NotebookTreeNode, level: number = 0) => {
    const indentLeft = level * 20;

    return (
      <View key={notebook.id}>
        <TouchableOpacity
          style={[
            styles.notebookOption,
            { marginLeft: indentLeft, backgroundColor: theme.surface },
          ]}
          onPress={() => onSelect(notebook.id)}
        >
          <View
            style={[
              styles.notebookIcon,
              { backgroundColor: notebook.color },
            ]}
          >
            <Text style={styles.icon}>{notebook.icon}</Text>
          </View>
          <Text style={[styles.notebookName, { color: theme.text }]}>
            {notebook.name}
          </Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {notebook.children.map((child) =>
          renderNotebookOption(child, level + 1)
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {title}
            </Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Option: No Notebook (Root Level) */}
            <TouchableOpacity
              style={[styles.notebookOption, { backgroundColor: theme.surface }]}
              onPress={() => onSelect(null)}
            >
              <View style={[styles.notebookIcon, { backgroundColor: '#8E8E93' }]}>
                <Text style={styles.icon}>📁</Text>
              </View>
              <Text style={[styles.notebookName, { color: theme.text }]}>
                No Notebook (Root)
              </Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            {/* Existing Notebooks */}
            {notebooks.map((notebook) => renderNotebookOption(notebook, 0))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeIcon: {
    fontSize: 24,
    color: '#8E8E93',
  },
  scrollView: {
    padding: spacing.md,
  },
  notebookOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginVertical: spacing.xs / 2,
    borderRadius: borderRadius.md,
  },
  notebookIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 18,
  },
  notebookName: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  chevron: {
    fontSize: 20,
    fontWeight: '300',
    color: '#8E8E93',
  },
});
