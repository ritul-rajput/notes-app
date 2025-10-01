import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
  TextInput as RNTextInput,
} from 'react-native';
import { NotebookTreeNode, Note } from '../../types/notebook';
import { NotebookItem } from '../../components/notebook/NotebookItem';
import { NoteCard } from '../../components/note/NoteCard';
import { CreateOptionsModal } from '../../components/modals/CreateOptionsModal';
import { LocationPickerModal } from '../../components/modals/LocationPickerModal';
import { colors, spacing, typography, borderRadius } from '../../theme';
import NotebookService from '../../services/NotebookService';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';

export const HomeScreen: React.FC = () => {
  const [notebookTree, setNotebookTree] = useState<NotebookTreeNode[]>([]);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [createAction, setCreateAction] = useState<'note' | 'notebook' | 'sub-notebook' | null>(null);
  const [selectedNotebook, setSelectedNotebook] = useState<string | null>(null);

  const { user, signOut } = useAuth();
  const { navigateTo } = useNavigation();
  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const results = NotebookService.searchNotes(searchQuery);
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadData = () => {
    const tree = NotebookService.getNotebookTree();
    const recent = NotebookService.getRecentNotes(10);
    setNotebookTree(tree);
    setRecentNotes(recent);
  };

  const handleToggleExpand = (notebookId: string) => {
    const toggleInTree = (nodes: NotebookTreeNode[]): NotebookTreeNode[] => {
      return nodes.map((node) => {
        if (node.id === notebookId) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children.length > 0) {
          return { ...node, children: toggleInTree(node.children) };
        }
        return node;
      });
    };

    setNotebookTree(toggleInTree(notebookTree));
  };

  const handleNotebookPress = (notebook: NotebookTreeNode) => {
    Alert.alert(
      notebook.name,
      `This notebook has ${notebook.noteCount} notes${
        notebook.subNotebookCount > 0
          ? ` and ${notebook.subNotebookCount} sub-notebooks`
          : ''
      }`
    );
  };

  const handleNotePress = (note: Note) => {
    navigateTo('editor', { noteId: note.id, note });
  };

  const handleNoteLongPress = (note: Note) => {
    Alert.alert(
      'Note Actions',
      'Pin, Delete, Lock, or Move note',
      [
        {
          text: note.isPinned ? 'Unpin' : 'Pin',
          onPress: async () => {
            await NotebookService.togglePin(note.id);
            loadData();
          },
        },
        { text: 'Delete', style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCreateOptionSelect = (optionId: string) => {
    setCreateAction(optionId as 'note' | 'notebook' | 'sub-notebook');
    
    if (optionId === 'note' || optionId === 'sub-notebook') {
      // Show location picker for notes and sub-notebooks
      setShowLocationPicker(true);
    } else if (optionId === 'notebook') {
      // Create notebook at root level directly
      promptForName('notebook', null);
    }
  };

  const handleLocationSelect = (notebookId: string | null) => {
    setSelectedNotebook(notebookId);
    setShowLocationPicker(false);
    
    if (createAction === 'note') {
      // Navigate to note editor (for now, just create)
      Alert.alert(
        'Note Editor',
        'This would open the combined editor screen with drawing + text',
        [
          {
            text: 'OK',
            onPress: async () => {
              const note = await NotebookService.createNote('Untitled Note', notebookId, 'mixed');
              loadData();
              Alert.alert('Success', `Note created in ${notebookId ? 'selected notebook' : 'root'}`);
            }
          }
        ]
      );
    } else if (createAction === 'sub-notebook') {
      promptForName('sub-notebook', notebookId);
    }
  };

  const promptForName = (type: 'notebook' | 'sub-notebook', parentId: string | null) => {
    Alert.prompt(
      `Create ${type === 'notebook' ? 'Notebook' : 'Sub-Notebook'}`,
      'Enter a name',
      async (name: string) => {
        if (name && name.trim()) {
          await NotebookService.createNotebook(name.trim(), parentId);
          loadData();
          Alert.alert('Success', `${type === 'notebook' ? 'Notebook' : 'Sub-notebook'} "${name}" created`);
        }
      }
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            📝 Quick Notes
          </Text>
          {user?.isGuest && (
            <Text style={[styles.guestBadge, { color: theme.warning }]}>
              ⏰ Guest Mode (24h limit)
            </Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Sign Out', 
                  style: 'destructive',
                  onPress: () => signOut()
                }
              ]
            );
          }}
        >
          <Text style={styles.headerIcon}>🚪</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search notes (including OCR text)..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {isSearching ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Search Results ({searchResults.length})
            </Text>
            {searchResults.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No notes found
              </Text>
            ) : (
              searchResults.map((note) => (
                <NoteCard key={note.id} note={note} onPress={handleNotePress} onLongPress={handleNoteLongPress} />
              ))
            )}
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Notes</Text>
              {recentNotes.slice(0, 3).map((note) => (
                <NoteCard key={note.id} note={note} onPress={handleNotePress} onLongPress={handleNoteLongPress} />
              ))}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Notebooks</Text>
                <TouchableOpacity onPress={() => promptForName('notebook', null)}>
                  <Text style={[styles.addButton, { color: theme.primary }]}>+ New</Text>
                </TouchableOpacity>
              </View>
              {notebookTree.map((notebook) => (
                <NotebookItem
                  key={notebook.id}
                  notebook={notebook}
                  level={0}
                  onPress={handleNotebookPress}
                  onToggleExpand={handleToggleExpand}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => setShowCreateOptions(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Create Options Modal */}
      <CreateOptionsModal
        visible={showCreateOptions}
        onSelect={handleCreateOptionSelect}
        onCancel={() => setShowCreateOptions(false)}
      />

      {/* Location Picker Modal */}
      <LocationPickerModal
        visible={showLocationPicker}
        notebooks={notebookTree}
        title={createAction === 'note' ? 'Select Notebook for Note' : 'Select Parent Notebook'}
        onSelect={handleLocationSelect}
        onCancel={() => setShowLocationPicker(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  headerTitle: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold },
  guestBadge: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, marginTop: 2 },
  headerButton: { padding: spacing.xs },
  headerIcon: { fontSize: 24 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', margin: spacing.md, padding: spacing.sm, borderRadius: borderRadius.md },
  searchIcon: { fontSize: 18, marginRight: spacing.sm },
  searchInput: { flex: 1, fontSize: typography.fontSize.md },
  clearIcon: { fontSize: 18, padding: spacing.xs },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  section: { marginTop: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md },
  sectionTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  addButton: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
  emptyText: { textAlign: 'center', padding: spacing.xl },
  fab: { position: 'absolute', right: spacing.lg, bottom: spacing.lg, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  fabIcon: { fontSize: 32, color: '#FFF', fontWeight: '300' },
});
