import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Note from '../models/Note';
import Notebook from '../models/Notebook';

const router = Router();

// Get all notes for a user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const { notebookId, pinned, limit } = req.query;

    let query: any = { userId };
    
    if (notebookId === 'null') {
      query.notebookId = null;
    } else if (notebookId) {
      query.notebookId = notebookId;
    }

    if (pinned === 'true') {
      query.isPinned = true;
    }

    let notesQuery = Note.find(query).sort({ updatedAt: -1 });
    
    if (limit) {
      notesQuery = notesQuery.limit(parseInt(limit as string));
    }

    const notes = await notesQuery;
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Search notes
router.get('/search', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const { q } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const notes = await Note.find({
      userId,
      $text: { $search: q as string },
    }).sort({ score: { $meta: 'textScore' } });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search notes' });
  }
});

// Get a single note
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    const note = await Note.findOne({ id, userId });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Create a new note
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const {
      title,
      content,
      notebookId,
      contentType,
      drawingData,
      ocrText,
      autoDeleteAt,
    } = req.body;

    const note = new Note({
      id: uuidv4(),
      userId,
      notebookId: notebookId || null,
      title: title || 'Untitled Note',
      content: content || '',
      contentType: contentType || 'text',
      drawingData,
      ocrText,
      autoDeleteAt,
    });

    await note.save();

    // Update notebook's noteCount
    if (notebookId) {
      await Notebook.findOneAndUpdate(
        { id: notebookId, userId },
        { $inc: { noteCount: 1 } }
      );
    }

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update a note
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;
    const updateData = req.body;

    const note = await Note.findOneAndUpdate(
      { id, userId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Toggle pin status
router.patch('/:id/pin', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    const note = await Note.findOne({ id, userId });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.isPinned = !note.isPinned;
    note.updatedAt = new Date();
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle pin' });
  }
});

// Delete a note
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    const note = await Note.findOneAndDelete({ id, userId });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Update notebook's noteCount
    if (note.notebookId) {
      await Notebook.findOneAndUpdate(
        { id: note.notebookId, userId },
        { $inc: { noteCount: -1 } }
      );
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
