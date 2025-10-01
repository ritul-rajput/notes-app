import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import { AdvancedDrawingCanvas } from '../../components/editor/AdvancedDrawingCanvas';
import { colors, spacing, typography, borderRadius } from '../../theme';

type EditorMode = 'text' | 'drawing' | 'split';
type ViewMode = 'edit' | 'preview';

interface Tag {
  id: string;
  name: string;
  color: string;
}

export const AdvancedEditorScreen: React.FC = () => {
  const [mode, setMode] = useState<EditorMode>('text');
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const availableTags: Tag[] = [
    { id: '1', name: 'Important', color: '#FF3B30' },
    { id: '2', name: 'Work', color: '#007AFF' },
    { id: '3', name: 'Personal', color: '#34C759' },
    { id: '4', name: 'Ideas', color: '#FFCC00' },
    { id: '5', name: 'Todo', color: '#FF9500' },
    { id: '6', name: 'Meeting', color: '#5856D6' },
  ];

  const handleTextChange = (text: string) => {
    setTextContent(text);
    const words = text.trim().split(/\s+/).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200)); // ~200 words per minute
  };

  const handleSave = () => {
    Alert.alert('Saved!', `"${title || 'Untitled'}" has been saved successfully.`);
  };

  const toggleTag = (tag: Tag) => {
    if (tags.find(t => t.id === tag.id)) {
      setTags(tags.filter(t => t.id !== tag.id));
    } else {
      setTags([...tags, tag]);
    }
  };

  const exportOptions = [
    { id: 'pdf', icon: '📄', name: 'Export as PDF' },
    { id: 'image', icon: '🖼️', name: 'Export as Image' },
    { id: 'markdown', icon: '📝', name: 'Export as Markdown' },
    { id: 'share', icon: '🔗', name: 'Share Link' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Advanced Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => Alert.alert('Go Back')} style={styles.headerBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <TextInput
              style={[styles.titleInput, { color: theme.text }]}
              placeholder="Untitled Note"
              placeholderTextColor={theme.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
            {/* Metadata */}
            <View style={styles.metadata}>
              <Text style={[styles.metadataText, { color: theme.textSecondary }]}>
                {wordCount} words • {readingTime} min read
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => setIsPinned(!isPinned)}
          >
            <Text style={styles.headerIcon}>{isPinned ? '📌' : '📍'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => setShowSettingsModal(true)}
          >
            <Text style={styles.headerIcon}>⚙️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: theme.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tags Bar */}
      <View style={[styles.tagsBar, { backgroundColor: theme.surface }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tags.map((tag) => (
            <View
              key={tag.id}
              style={[styles.tag, { backgroundColor: tag.color + '20' }]}
            >
              <Text style={[styles.tagText, { color: tag.color }]}>{tag.name}</Text>
              <TouchableOpacity onPress={() => toggleTag(tag)}>
                <Text style={styles.tagRemove}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.addTagBtn, { borderColor: theme.border }]}
            onPress={() => setShowTagModal(true)}
          >
            <Text style={[styles.addTagText, { color: theme.textSecondary }]}>
              + Add Tag
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
          <Text style={[styles.tabIcon, mode === 'text' && { color: theme.primary }]}>
            📝
          </Text>
          <Text style={[styles.tabText, mode === 'text' && { color: theme.primary }]}>
            Text
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
          <Text style={[styles.tabIcon, mode === 'drawing' && { color: theme.primary }]}>
            🎨
          </Text>
          <Text style={[styles.tabText, mode === 'drawing' && { color: theme.primary }]}>
            Drawing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            mode === 'split' && styles.tabActive,
            mode === 'split' && { borderBottomColor: theme.primary },
          ]}
          onPress={() => setMode('split')}
        >
          <Text style={[styles.tabIcon, mode === 'split' && { color: theme.primary }]}>
            ⚡
          </Text>
          <Text style={[styles.tabText, mode === 'split' && { color: theme.primary }]}>
            Split
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            viewMode === 'preview' && styles.tabActive,
            viewMode === 'preview' && { borderBottomColor: theme.primary },
          ]}
          onPress={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
        >
          <Text style={[styles.tabIcon, viewMode === 'preview' && { color: theme.primary }]}>
            👁️
          </Text>
          <Text style={[styles.tabText, viewMode === 'preview' && { color: theme.primary }]}>
            Preview
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {mode === 'text' && (
          <RichTextEditor
            content={textContent}
            onChange={handleTextChange}
            placeholder="Start writing something amazing..."
          />
        )}

        {mode === 'drawing' && <AdvancedDrawingCanvas />}

        {mode === 'split' && (
          <View style={styles.splitView}>
            <View style={styles.splitPane}>
              <RichTextEditor
                content={textContent}
                onChange={handleTextChange}
                placeholder="Text editor..."
              />
            </View>
            <View style={[styles.splitDivider, { backgroundColor: theme.border }]} />
            <View style={styles.splitPane}>
              <AdvancedDrawingCanvas />
            </View>
          </View>
        )}
      </View>

      {/* Tag Selection Modal */}
      <Modal
        visible={showTagModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTagModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTagModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Add Tags</Text>
            <ScrollView style={styles.tagList}>
              {availableTags.map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  style={[
                    styles.tagOption,
                    tags.find(t => t.id === tag.id) && { backgroundColor: tag.color + '20' },
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <View style={[styles.tagColorDot, { backgroundColor: tag.color }]} />
                  <Text style={[styles.tagOptionText, { color: theme.text }]}>
                    {tag.name}
                  </Text>
                  {tags.find(t => t.id === tag.id) && (
                    <Text style={styles.tagCheckmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalBtn, { borderColor: theme.border }]}
              onPress={() => setShowTagModal(false)}
            >
              <Text style={[styles.modalBtnText, { color: theme.text }]}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSettingsModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Note Settings</Text>

            {/* Export Options */}
            <View style={styles.settingsSection}>
              <Text style={[styles.settingsSectionTitle, { color: theme.text }]}>
                Export
              </Text>
              {exportOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.settingsOption}
                  onPress={() => Alert.alert(option.name)}
                >
                  <Text style={styles.settingsIcon}>{option.icon}</Text>
                  <Text style={[styles.settingsText, { color: theme.text }]}>
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Security */}
            <View style={styles.settingsSection}>
              <Text style={[styles.settingsSectionTitle, { color: theme.text }]}>
                Security
              </Text>
              <TouchableOpacity
                style={styles.settingsOption}
                onPress={() => setIsLocked(!isLocked)}
              >
                <Text style={styles.settingsIcon}>{isLocked ? '🔒' : '🔓'}</Text>
                <Text style={[styles.settingsText, { color: theme.text }]}>
                  {isLocked ? 'Unlock Note' : 'Lock Note'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.modalBtn, { borderColor: theme.border }]}
              onPress={() => setShowSettingsModal(false)}
            >
              <Text style={[styles.modalBtnText, { color: theme.text }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerBtn: { padding: spacing.xs, marginRight: spacing.xs },
  backIcon: { fontSize: 24 },
  titleContainer: { flex: 1, marginLeft: spacing.sm },
  titleInput: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    padding: 0,
  },
  metadata: { marginTop: 2 },
  metadataText: { fontSize: typography.fontSize.xs },
  headerIcon: { fontSize: 20 },
  saveBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  saveBtnText: { color: '#FFF', fontWeight: typography.fontWeight.semibold },
  tagsBar: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
  },
  tagText: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium },
  tagRemove: { marginLeft: spacing.xs, fontSize: 12 },
  addTagBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addTagText: { fontSize: typography.fontSize.xs },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomWidth: 2 },
  tabIcon: { fontSize: 18, marginRight: spacing.xs },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: '#8E8E93',
  },
  contentArea: { flex: 1 },
  splitView: { flex: 1, flexDirection: 'row' },
  splitPane: { flex: 1 },
  splitDivider: { width: 2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
  },
  tagList: { maxHeight: 300 },
  tagOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  tagColorDot: { width: 12, height: 12, borderRadius: 6, marginRight: spacing.sm },
  tagOptionText: { flex: 1, fontSize: typography.fontSize.md },
  tagCheckmark: { fontSize: 18, color: '#34C759' },
  modalBtn: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  modalBtnText: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold },
  settingsSection: { marginBottom: spacing.lg },
  settingsSectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  settingsIcon: { fontSize: 20, marginRight: spacing.md, width: 24 },
  settingsText: { fontSize: typography.fontSize.md },
});
