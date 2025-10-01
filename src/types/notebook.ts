export interface Notebook {
  id: string;
  name: string;
  parentId: string | null;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
  noteCount: number;
  subNotebookCount: number;
}

export interface Note {
  id: string;
  userId: string;
  notebookId: string | null;
  title: string;
  content: string;
  contentType: 'text' | 'drawing' | 'mixed';
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isLocked: boolean;
  drawingData?: string;
  ocrText?: string;
  autoDeleteAt?: Date;
}

export interface NotebookTreeNode extends Notebook {
  children: NotebookTreeNode[];
  notes: Note[];
  isExpanded?: boolean;
}
