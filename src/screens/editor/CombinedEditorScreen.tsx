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
  Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';

type EditorMode = 'text' | 'drawing';

export const CombinedEditorScreen: React.FC = () => {
  const [mode, setMode] = useState<EditorMode>('text');
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [drawingTool, setDrawingTool] = useState<'pen' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState('#000000');

  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const colors_palette = [
    '#000000', '#FF3B30', '#007AFF', '#34C759', 
    '#FFCC00', '#FF9500', '#5856D6', '#8E8E93'
  ];

  const handleSave = () => {
    Alert.alert('Save', `Note "${title || 'Untitled'}" saved successfully!`);
  };

  const handleBack = () => {
    Alert.alert(
      'Discard Changes?',
      'Are you sure you want to go back?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => {} }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <TextInput
          style={[styles.titleInput, { color: theme.text }]}
          placeholder="Untitled Note"
          placeholderTextColor={theme.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
          <Text style={[styles.saveText, { color: theme.primary }]}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Mode Tabs */}
      <View style={[styles.tabContainer, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            mode === 'text' && styles.tabActive,
            mode === 'text' && { borderBottomColor: theme.primary },
          ]}
          onPress={() => setMode('text')}
        >
          <Text style={[styles.tabText, mode === 'text' && { color: theme.primary }]}>
            📝 Text
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            mode === 'drawing' && styles.tabActive,
            mode === 'drawing' && { borderBottomColor: theme.primary },
          ]}
          onPress={() => setMode('drawing')}
        >
          <Text style={[styles.tabText, mode === 'drawing' && { color: theme.primary }]}>
            🎨 Drawing
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      {mode === 'text' ? (
        /* Text Editor */
        <ScrollView style={styles.contentArea}>
          <TextInput
            style={[styles.textEditor, { color: theme.text }]}
            placeholder="Start typing your note..."
            placeholderTextColor={theme.textSecondary}
            value={textContent}
            onChangeText={setTextContent}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      ) : (
        /* Drawing Board */
        <View style={styles.contentArea}>
          <View style={[styles.drawingCanvas, { backgroundColor: '#FFFFFF' }]}>
            <Text style={styles.canvasPlaceholder}>
              🎨 Drawing canvas will be here
            </Text>
            <Text style={[styles.canvasSubtext, { color: theme.textSecondary }]}>
              (React Native Skia integration pending)
            </Text>
          </View>

          {/* Drawing Tools */}
          <View style={[styles.toolsBar, { backgroundColor: theme.surface }]}>
            <View style={styles.toolsSection}>
              <Text style={[styles.toolsLabel, { color: theme.text }]}>Tool:</Text>
              <TouchableOpacity
                style={[
                  styles.toolButton,
                  drawingTool === 'pen' && { backgroundColor: theme.primary },
                ]}
                onPress={() => setDrawingTool('pen')}
              >
                <Text style={styles.toolIcon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toolButton,
                  drawingTool === 'eraser' && { backgroundColor: theme.primary },
                ]}
                onPress={() => setDrawingTool('eraser')}
              >
                <Text style={styles.toolIcon}>🧹</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.toolsSection}>
              <Text style={[styles.toolsLabel, { color: theme.text }]}>Color:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {colors_palette.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      penColor === color && styles.colorButtonSelected,
                    ]}
                    onPress={() => setPenColor(color)}
                  />
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity style={[styles.clearButton, { backgroundColor: theme.error }]}>
              <Text style={styles.clearButtonText}>Clear Canvas</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: spacing.xs,
  },
  backIcon: {
    fontSize: 24,
  },
  titleInput: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginHorizontal: spacing.md,
    padding: spacing.xs,
  },
  saveText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: '#8E8E93',
  },
  contentArea: {
    flex: 1,
  },
  textEditor: {
    flex: 1,
    padding: spacing.lg,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.lg,
  },
  drawingCanvas: {
    flex: 1,
    margin: spacing.md,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasPlaceholder: {
    fontSize: typography.fontSize.xl,
    marginBottom: spacing.sm,
  },
  canvasSubtext: {
    fontSize: typography.fontSize.sm,
  },
  toolsBar: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  toolsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  toolsLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginRight: spacing.sm,
    width: 50,
  },
  toolButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
    backgroundColor: '#F2F2F7',
  },
  toolIcon: {
    fontSize: 20,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  clearButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});
