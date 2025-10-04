import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
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

const NoteSchema = new Schema<INote>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    notebookId: { type: String, default: null },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    contentType: { 
      type: String, 
      enum: ['text', 'drawing', 'mixed'], 
      default: 'text' 
    },
    isPinned: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    drawingData: { type: String },
    ocrText: { type: String },
    autoDeleteAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
NoteSchema.index({ userId: 1, notebookId: 1 });
NoteSchema.index({ userId: 1, isPinned: 1 });
NoteSchema.index({ userId: 1, updatedAt: -1 });

// Text search index
NoteSchema.index({ title: 'text', content: 'text', ocrText: 'text' });

export default mongoose.model<INote>('Note', NoteSchema);
