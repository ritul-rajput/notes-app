import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Notebook from '../models/Notebook';

const router = Router();

// Get all notebooks for a user (hierarchical tree)
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const notebooks = await Notebook.find({ userId }).sort({ createdAt: 1 });
    
    // Build hierarchical tree
    const buildTree = (parentId: string | null): any[] => {
      return notebooks
        .filter((nb) => nb.parentId === parentId)
        .map((nb) => ({
          id: nb.id,
          name: nb.name,
          parentId: nb.parentId,
          color: nb.color,
          icon: nb.icon,
          createdAt: nb.createdAt,
          updatedAt: nb.updatedAt,
          noteCount: nb.noteCount,
          subNotebookCount: nb.subNotebookCount,
          children: buildTree(nb.id),
        }));
    };

    const tree = buildTree(null);
    res.json(tree);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notebooks' });
  }
});

// Create a new notebook
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const { name, parentId, color, icon } = req.body;

    const notebook = new Notebook({
      id: uuidv4(),
      userId,
      name,
      parentId: parentId || null,
      color: color || '#007AFF',
      icon: icon || '📁',
    });

    await notebook.save();

    // Update parent's subNotebookCount
    if (parentId) {
      await Notebook.findOneAndUpdate(
        { id: parentId, userId },
        { $inc: { subNotebookCount: 1 } }
      );
    }

    res.status(201).json(notebook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notebook' });
  }
});

// Update a notebook
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;
    const { name, color, icon } = req.body;

    const notebook = await Notebook.findOneAndUpdate(
      { id, userId },
      { name, color, icon },
      { new: true }
    );

    if (!notebook) {
      return res.status(404).json({ error: 'Notebook not found' });
    }

    res.json(notebook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notebook' });
  }
});

// Delete a notebook
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    const notebook = await Notebook.findOneAndDelete({ id, userId });

    if (!notebook) {
      return res.status(404).json({ error: 'Notebook not found' });
    }

    // Update parent's subNotebookCount
    if (notebook.parentId) {
      await Notebook.findOneAndUpdate(
        { id: notebook.parentId, userId },
        { $inc: { subNotebookCount: -1 } }
      );
    }

    res.json({ message: 'Notebook deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notebook' });
  }
});

export default router;
