import { Notebook, Note, NotebookTreeNode } from '../types/notebook';

class NotebookService {
  private notebooks: Notebook[] = [];
  private notes: Note[] = [];

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize with mock data for preview
   */
  private initializeMockData() {
    // Mock notebooks
    this.notebooks = [
      {
        id: 'nb-1',
        name: 'Personal',
        parentId: null,
        color: '#007AFF',
        icon: '📝',
        createdAt: new Date('2025-09-01'),
        updatedAt: new Date('2025-09-30'),
        noteCount: 3,
        subNotebookCount: 2,
      },
      {
        id: 'nb-2',
        name: 'Work',
        parentId: null,
        color: '#34C759',
        icon: '💼',
        createdAt: new Date('2025-09-05'),
        updatedAt: new Date('2025-09-29'),
        noteCount: 5,
        subNotebookCount: 1,
      },
      {
        id: 'nb-1-1',
        name: 'Daily Journal',
        parentId: 'nb-1',
        color: '#5856D6',
        icon: '📔',
        createdAt: new Date('2025-09-10'),
        updatedAt: new Date('2025-09-28'),
        noteCount: 2,
        subNotebookCount: 0,
      },
      {
        id: 'nb-1-2',
        name: 'Ideas',
        parentId: 'nb-1',
        color: '#FF9500',
        icon: '💡',
        createdAt: new Date('2025-09-15'),
        updatedAt: new Date('2025-09-27'),
        noteCount: 1,
        subNotebookCount: 0,
      },
      {
        id: 'nb-2-1',
        name: 'Meetings',
        parentId: 'nb-2',
        color: '#FF3B30',
        icon: '🗓️',
        createdAt: new Date('2025-09-20'),
        updatedAt: new Date('2025-09-26'),
        noteCount: 3,
        subNotebookCount: 0,
      },
    ];

    // Mock notes
    this.notes = [
      {
        id: 'note-1',
        userId: 'user-1',
        notebookId: 'nb-1-1',
        title: 'Today\'s Thoughts',
        content: 'Had a great day today. Need to remember to...',
        contentType: 'text',
        createdAt: new Date('2025-09-30T10:00:00'),
        updatedAt: new Date('2025-09-30T10:30:00'),
        isPinned: true,
        isLocked: false,
      },
      {
        id: 'note-2',
        userId: 'user-1',
        notebookId: 'nb-1-2',
        title: 'App Design Ideas',
        content: '',
        contentType: 'drawing',
        createdAt: new Date('2025-09-29T15:20:00'),
        updatedAt: new Date('2025-09-29T15:45:00'),
        isPinned: false,
        isLocked: false,
        drawingData: 'mock-drawing-data',
      },
      {
        id: 'note-3',
        userId: 'user-1',
        notebookId: 'nb-2-1',
        title: 'Team Standup Notes',
        content: 'Discussed project timeline and milestones...',
        contentType: 'text',
        createdAt: new Date('2025-09-28T09:00:00'),
        updatedAt: new Date('2025-09-28T09:15:00'),
        isPinned: false,
        isLocked: false,
      },
      {
        id: 'note-4',
        userId: 'user-1',
        notebookId: null,
        title: 'Quick Note',
        content: 'Remember to buy groceries',
        contentType: 'text',
        createdAt: new Date('2025-09-27T18:00:00'),
        updatedAt: new Date('2025-09-27T18:05:00'),
        isPinned: false,
        isLocked: false,
      },
    ];
  }

  /**
   * Get all notebooks as a hierarchical tree
   */
  getNotebookTree(): NotebookTreeNode[] {
    const buildTree = (parentId: string | null): NotebookTreeNode[] => {
      return this.notebooks
        .filter((nb) => nb.parentId === parentId)
        .map((nb) => ({
          ...nb,
          children: buildTree(nb.id),
          notes: this.notes.filter((note) => note.notebookId === nb.id),
          isExpanded: false,
        }));
    };

    return buildTree(null);
  }

  /**
   * Get all notes (not in any notebook)
   */
  getUnorganizedNotes(): Note[] {
    return this.notes.filter((note) => note.notebookId === null);
  }

  /**
   * Get recent notes
   */
  getRecentNotes(limit: number = 10): Note[] {
    return [...this.notes]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Get pinned notes
   */
  getPinnedNotes(): Note[] {
    return this.notes.filter((note) => note.isPinned);
  }

  /**
   * Search notes (including OCR text)
   */
  searchNotes(query: string): Note[] {
    if (!query.trim()) {
      return this.notes;
    }

    const lowerQuery = query.toLowerCase();
    return this.notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery) ||
        (note.ocrText && note.ocrText.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Create a new notebook
   */
  async createNotebook(
    name: string,
    parentId: string | null = null,
    color: string = '#007AFF',
    icon: string = '📁'
  ): Promise<Notebook> {
    const notebook: Notebook = {
      id: `nb-${Date.now()}`,
      name,
      parentId,
      color,
      icon,
      createdAt: new Date(),
      updatedAt: new Date(),
      noteCount: 0,
      subNotebookCount: 0,
    };

    this.notebooks.push(notebook);
    return notebook;
  }

  /**
   * Create a new note
   */
  async createNote(
    title: string,
    notebookId: string | null = null,
    contentType: 'text' | 'drawing' | 'mixed' = 'text'
  ): Promise<Note> {
    const note: Note = {
      id: `note-${Date.now()}`,
      userId: 'user-1',
      notebookId,
      title: title || 'Untitled Note',
      content: '',
      contentType,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      isLocked: false,
    };

    this.notes.push(note);
    return note;
  }

  /**
   * Delete a note
   */
  async deleteNote(noteId: string): Promise<void> {
    this.notes = this.notes.filter((note) => note.id !== noteId);
  }

  /**
   * Toggle pin status
   */
  async togglePin(noteId: string): Promise<void> {
    const note = this.notes.find((n) => n.id === noteId);
    if (note) {
      note.isPinned = !note.isPinned;
      note.updatedAt = new Date();
    }
  }
}

export default new NotebookService();
