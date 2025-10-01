import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useNavigation } from '../../context/NavigationContext';

interface DrawingBlock {
  id: string;
  position: number; // Character position in text
}

export const AppleNotesStyleScreen: React.FC = () => {
  const { goBack, navigationParams } = useNavigation();
  const [title, setTitle] = useState(navigationParams?.note?.title || '');
  const [noteContent, setNoteContent] = useState(navigationParams?.note?.content || '');
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const [drawings, setDrawings] = useState<DrawingBlock[]>([]);

  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const insertDrawing = () => {
    Alert.alert(
      'Insert Drawing',
      'A drawing canvas would open here',
      [
        {
          text: 'Insert',
          onPress: () => {
            const newDrawing: DrawingBlock = {
              id: Date.now().toString(),
              position: noteContent.length,
            };
            setDrawings([...drawings, newDrawing]);
            setNoteContent(noteContent + '\n[Drawing]\n');
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={goBack}>
            <Text style={[styles.headerBtn, { color: theme.primary }]}>← Notes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => Alert.alert('Saved!', 'Note saved successfully')}>
            <Text style={[styles.headerBtn, { color: theme.primary }]}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Note Content */}
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <TextInput
            style={[styles.titleInput, { color: theme.text }]}
            placeholder="Title"
            placeholderTextColor={theme.textSecondary}
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
          />

          {/* Date */}
          <Text style={[styles.dateText, { color: theme.textSecondary }]}>
            {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </Text>

          {/* Body Text */}
          <TextInput
            style={[styles.bodyInput, { color: theme.text }]}
            placeholder="Start typing..."
            placeholderTextColor={theme.textSecondary}
            value={noteContent}
            onChangeText={setNoteContent}
            multiline
            textAlignVertical="top"
            onFocus={() => setShowDrawingTools(false)}
          />
        </ScrollView>

        {/* Toolbar - Only shows when typing */}
        <View style={[styles.toolbar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toolbarContent}
          >
            <TouchableOpacity style={styles.toolButton}>
              <Text style={styles.toolIcon}>✓</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton}>
              <Text style={styles.toolIcon}>📷</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toolButton, styles.drawingButton]}
              onPress={insertDrawing}
            >
              <Text style={styles.toolIcon}>✏️</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.toolButton}>
              <Text style={[styles.toolText, { fontWeight: 'bold' }]}>B</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton}>
              <Text style={[styles.toolText, { fontStyle: 'italic' }]}>I</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton}>
              <Text style={[styles.toolText, { textDecorationLine: 'underline' }]}>U</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.toolButton}>
              <Text style={styles.toolIcon}>Aa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton}>
              <Text style={styles.toolIcon}>•</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton}>
              <Text style={styles.toolIcon}>1.</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.toolButton}>
              <Text style={styles.toolIcon}>⤴️</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
  },
  headerBtn: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  headerIcon: {
    fontSize: 24,
    color: '#007AFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.xs,
    padding: 0,
  },
  dateText: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.lg,
  },
  bodyInput: {
    fontSize: typography.fontSize.md,
    lineHeight: 24,
    minHeight: 300,
    padding: 0,
  },
  toolbar: {
    borderTopWidth: 0.5,
    paddingVertical: spacing.xs,
  },
  toolbarContent: {
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  toolButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  drawingButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  toolIcon: {
    fontSize: 20,
  },
  toolText: {
    fontSize: 18,
    color: '#000',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E5EA',
    marginHorizontal: spacing.sm,
  },
});
