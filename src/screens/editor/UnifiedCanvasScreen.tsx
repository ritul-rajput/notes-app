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

type Tool = 'text' | 'pen' | 'pencil' | 'highlighter' | 'eraser' | 'shape' | 'image';

export const UnifiedCanvasScreen: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>('text');
  const [title, setTitle] = useState('');
  const [penColor, setPenColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showToolOptions, setShowToolOptions] = useState(false);

  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const tools = [
    { id: 'text', icon: '📝', name: 'Text', color: '#007AFF' },
    { id: 'pen', icon: '🖊️', name: 'Pen', color: '#000000' },
    { id: 'pencil', icon: '✏️', name: 'Pencil', color: '#8E8E93' },
    { id: 'highlighter', icon: '💡', name: 'Highlighter', color: '#FFCC00' },
    { id: 'eraser', icon: '🧹', name: 'Eraser', color: '#FF3B30' },
    { id: 'shape', icon: '⬜', name: 'Shapes', color: '#5856D6' },
    { id: 'image', icon: '📷', name: 'Image', color: '#34C759' },
  ];

  const quickColors = [
    '#000000', '#FFFFFF', '#FF3B30', '#FF9500', 
    '#FFCC00', '#34C759', '#007AFF', '#5856D6',
  ];

  const strokeWidths = [
    { size: 1, label: 'Thin' },
    { size: 2, label: 'Regular' },
    { size: 4, label: 'Medium' },
    { size: 8, label: 'Thick' },
    { size: 16, label: 'Bold' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Minimal Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => Alert.alert('Back')}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.titleInput, { color: theme.text }]}
          placeholder="Note Title"
          placeholderTextColor={theme.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <Text style={styles.headerIcon}>⋯</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.saveBtn, { backgroundColor: theme.primary }]}
            onPress={() => Alert.alert('Saved!')}
          >
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Unified Canvas Area */}
      <ScrollView 
        style={styles.canvasScroll}
        contentContainerStyle={styles.canvasContent}
      >
        <View style={styles.canvas}>
          <Text style={[styles.canvasHint, { color: theme.textSecondary }]}>
            Tap anywhere to start typing or drawing...
          </Text>
          
          <View style={styles.canvasPlaceholder}>
            <Text style={styles.placeholderIcon}>✨</Text>
            <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
              Write and draw together in one place
            </Text>
            <Text style={[styles.placeholderSubtext, { color: theme.textSecondary }]}>
              Switch between tools using the floating toolbar below
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Toolbar - Always Visible */}
      <View style={[styles.floatingToolbar, { backgroundColor: theme.background }]}>
        {/* Tool Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.toolsScroll}
          contentContainerStyle={styles.toolsContainer}
        >
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={[
                styles.toolBtn,
                activeTool === tool.id && { 
                  backgroundColor: tool.color + '20',
                  transform: [{ scale: 1.1 }],
                },
              ]}
              onPress={() => setActiveTool(tool.id as Tool)}
            >
              <Text style={styles.toolIcon}>{tool.icon}</Text>
              {activeTool === tool.id && (
                <Text style={[styles.toolLabel, { color: tool.color }]}>
                  {tool.name}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Actions Bar */}
        <View style={styles.quickActions}>
          {/* Color Picker Button */}
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: theme.surface }]}
            onPress={() => setShowColorPicker(!showColorPicker)}
          >
            <View style={[styles.colorPreview, { backgroundColor: penColor }]} />
            <Text style={[styles.quickBtnText, { color: theme.text }]}>Color</Text>
          </TouchableOpacity>

          {/* Stroke Width Button */}
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: theme.surface }]}
            onPress={() => setShowToolOptions(!showToolOptions)}
          >
            <Text style={styles.quickBtnIcon}>━</Text>
            <Text style={[styles.quickBtnText, { color: theme.text }]}>
              {strokeWidth}px
            </Text>
          </TouchableOpacity>

          {/* Undo */}
          <TouchableOpacity style={[styles.quickBtn, { backgroundColor: theme.surface }]}>
            <Text style={styles.quickBtnIcon}>↶</Text>
          </TouchableOpacity>

          {/* Redo */}
          <TouchableOpacity style={[styles.quickBtn, { backgroundColor: theme.surface }]}>
            <Text style={styles.quickBtnIcon}>↷</Text>
          </TouchableOpacity>

          {/* Clear */}
          <TouchableOpacity 
            style={[styles.quickBtn, { backgroundColor: theme.error + '20' }]}
            onPress={() => Alert.alert('Clear', 'Clear everything?', [
              { text: 'Cancel' },
              { text: 'Clear', style: 'destructive' }
            ])}
          >
            <Text style={styles.quickBtnIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {/* Color Picker Popup */}
        {showColorPicker && (
          <View style={[styles.optionsPopup, { backgroundColor: theme.surface }]}>
            <Text style={[styles.optionsTitle, { color: theme.text }]}>
              Choose Color
            </Text>
            <View style={styles.colorGrid}>
              {quickColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    penColor === color && styles.colorOptionSelected,
                    color === '#FFFFFF' && { borderWidth: 1, borderColor: '#E5E5EA' },
                  ]}
                  onPress={() => {
                    setPenColor(color);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Stroke Width Popup */}
        {showToolOptions && (
          <View style={[styles.optionsPopup, { backgroundColor: theme.surface }]}>
            <Text style={[styles.optionsTitle, { color: theme.text }]}>
              Stroke Width
            </Text>
            <View style={styles.strokeOptions}>
              {strokeWidths.map((sw) => (
                <TouchableOpacity
                  key={sw.size}
                  style={[
                    styles.strokeOption,
                    strokeWidth === sw.size && { backgroundColor: theme.primary + '20' },
                  ]}
                  onPress={() => {
                    setStrokeWidth(sw.size);
                    setShowToolOptions(false);
                  }}
                >
                  <View 
                    style={[
                      styles.strokePreview, 
                      { 
                        height: sw.size,
                        backgroundColor: theme.text 
                      }
                    ]} 
                  />
                  <Text style={[styles.strokeLabel, { color: theme.text }]}>
                    {sw.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Tool Info Banner */}
      <View style={[styles.toolInfo, { backgroundColor: theme.primary + '15' }]}>
        <Text style={[styles.toolInfoText, { color: theme.primary }]}>
          {activeTool === 'text' && '📝 Tap to type anywhere on the canvas'}
          {activeTool === 'pen' && '🖊️ Draw smooth lines'}
          {activeTool === 'pencil' && '✏️ Sketch with pencil texture'}
          {activeTool === 'highlighter' && '💡 Highlight text and drawings'}
          {activeTool === 'eraser' && '🧹 Erase parts of your drawing'}
          {activeTool === 'shape' && '⬜ Draw perfect shapes'}
          {activeTool === 'image' && '📷 Insert images from camera or gallery'}
        </Text>
      </View>
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
  headerBtn: {
    padding: spacing.xs,
  },
  headerIcon: {
    fontSize: 24,
  },
  titleInput: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginHorizontal: spacing.sm,
    padding: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  saveBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
  },
  canvasScroll: {
    flex: 1,
  },
  canvasContent: {
    flexGrow: 1,
  },
  canvas: {
    flex: 1,
    padding: spacing.lg,
    minHeight: 500,
  },
  canvasHint: {
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  canvasPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  placeholderText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  floatingToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: spacing.sm,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  toolsScroll: {
    maxHeight: 80,
  },
  toolsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    flexDirection: 'row',
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginRight: spacing.xs,
    backgroundColor: '#F2F2F7',
    minWidth: 60,
    justifyContent: 'center',
  },
  toolIcon: {
    fontSize: 28,
  },
  toolLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    gap: spacing.xs,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  quickBtnIcon: {
    fontSize: 18,
  },
  quickBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  optionsPopup: {
    position: 'absolute',
    bottom: 140,
    left: spacing.md,
    right: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  optionsTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#007AFF',
  },
  strokeOptions: {
    gap: spacing.xs,
  },
  strokeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  strokePreview: {
    width: 60,
    borderRadius: 2,
  },
  strokeLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  toolInfo: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  toolInfoText: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
  },
});
