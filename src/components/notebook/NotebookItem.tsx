import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { NotebookTreeNode } from '../../types/notebook';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface NotebookItemProps {
  notebook: NotebookTreeNode;
  level: number;
  onPress: (notebook: NotebookTreeNode) => void;
  onToggleExpand: (notebookId: string) => void;
}

export const NotebookItem: React.FC<NotebookItemProps> = ({
  notebook,
  level,
  onPress,
  onToggleExpand,
}) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const hasChildren = notebook.children.length > 0;
  const indentLeft = level * 20;

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: theme.surface, marginLeft: indentLeft },
        ]}
        onPress={() => onPress(notebook)}
        activeOpacity={0.7}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren && (
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => onToggleExpand(notebook.id)}
          >
            <Text style={styles.expandIcon}>
              {notebook.isExpanded ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Notebook Icon */}
        <View
          style={[styles.iconContainer, { backgroundColor: notebook.color }]}
        >
          <Text style={styles.icon}>{notebook.icon}</Text>
        </View>

        {/* Notebook Info */}
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]}>
            {notebook.name}
          </Text>
          <Text style={[styles.count, { color: theme.textSecondary }]}>
            {notebook.noteCount} note{notebook.noteCount !== 1 ? 's' : ''}
            {notebook.subNotebookCount > 0 &&
              ` • ${notebook.subNotebookCount} notebook${
                notebook.subNotebookCount !== 1 ? 's' : ''
              }`}
          </Text>
        </View>

        {/* Chevron */}
        <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
      </TouchableOpacity>

      {/* Render Children */}
      {notebook.isExpanded &&
        notebook.children.map((child) => (
          <NotebookItem
            key={child.id}
            notebook={child}
            level={level + 1}
            onPress={onPress}
            onToggleExpand={onToggleExpand}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginVertical: spacing.xs / 2,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  expandButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  expandIcon: {
    fontSize: 12,
    color: '#8E8E93',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: 2,
  },
  count: {
    fontSize: typography.fontSize.xs,
  },
  chevron: {
    fontSize: 20,
    fontWeight: '300',
  },
});
