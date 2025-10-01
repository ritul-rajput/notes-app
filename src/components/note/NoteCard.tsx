import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Note } from '../../types/notebook';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface NoteCardProps {
  note: Note;
  onPress: (note: Note) => void;
  onLongPress?: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onPress,
  onLongPress,
}) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const getContentTypeIcon = () => {
    switch (note.contentType) {
      case 'text':
        return '📝';
      case 'drawing':
        return '🎨';
      case 'mixed':
        return '📝🎨';
      default:
        return '📄';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.card }]}
      onPress={() => onPress(note)}
      onLongPress={() => onLongPress?.(note)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.typeIcon}>{getContentTypeIcon()}</Text>
          <Text
            style={[styles.title, { color: theme.text }]}
            numberOfLines={1}
          >
            {note.title}
          </Text>
        </View>
        <View style={styles.headerRight}>
          {note.isPinned && <Text style={styles.pinIcon}>📌</Text>}
          {note.isLocked && <Text style={styles.lockIcon}>🔒</Text>}
        </View>
      </View>

      {/* Content Preview */}
      {note.contentType === 'text' && note.content && (
        <Text
          style={[styles.content, { color: theme.textSecondary }]}
          numberOfLines={2}
        >
          {note.content}
        </Text>
      )}

      {note.contentType === 'drawing' && (
        <View style={[styles.drawingPreview, { backgroundColor: theme.surface }]}>
          <Text style={[styles.drawingText, { color: theme.textSecondary }]}>
            ✏️ Drawing note
          </Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.date, { color: theme.textSecondary }]}>
          {formatDate(note.updatedAt)}
        </Text>
        {note.ocrText && (
          <View style={styles.ocrBadge}>
            <Text style={styles.ocrText}>OCR</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  typeIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    flex: 1,
  },
  pinIcon: {
    fontSize: 14,
  },
  lockIcon: {
    fontSize: 14,
  },
  content: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.md,
    marginBottom: spacing.xs,
  },
  drawingPreview: {
    height: 60,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  drawingText: {
    fontSize: typography.fontSize.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: typography.fontSize.xs,
  },
  ocrBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  ocrText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.semibold,
  },
});
