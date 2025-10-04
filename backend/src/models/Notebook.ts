import mongoose, { Document, Schema } from 'mongoose';

export interface INotebook extends Document {
  id: string;
  userId: string;
  name: string;
  parentId: string | null;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
  noteCount: number;
  subNotebookCount: number;
}

const NotebookSchema = new Schema<INotebook>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    parentId: { type: String, default: null },
    color: { type: String, default: '#007AFF' },
    icon: { type: String, default: '📁' },
    noteCount: { type: Number, default: 0 },
    subNotebookCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
NotebookSchema.index({ userId: 1, parentId: 1 });

export default mongoose.model<INotebook>('Notebook', NotebookSchema);
