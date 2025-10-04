import { Note, Notebook } from '../types/notebook';

// Configure API URL based on platform
// For iOS Simulator: localhost works
// For Android Emulator: use 10.0.2.2
// For Physical Device: use your computer's local IP
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Change to 10.0.2.2 for Android emulator
  : 'https://your-production-api.com/api';

class ApiService {
  private userId: string = 'test-user'; // Will be set from auth
  private baseUrl: string = API_BASE_URL;

  /**
   * Set user ID (call this after authentication)
   */
  setUserId(userId: string) {
    this.userId = userId;
  }

  /**
   * Set API base URL (useful for switching environments)
   */
  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  /**
   * Generic request handler
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'x-user-id': this.userId,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      return response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // ==================== NOTES API ====================

  /**
   * Get all notes for the current user
   */
  async getNotes(options?: {
    notebookId?: string | null;
    pinned?: boolean;
    limit?: number;
  }): Promise<Note[]> {
    const params = new URLSearchParams();
    
    if (options?.notebookId !== undefined) {
      params.append('notebookId', options.notebookId || 'null');
    }
    if (options?.pinned) {
      params.append('pinned', 'true');
    }
    if (options?.limit) {
      params.append('limit', options.limit.toString());
    }

    const query = params.toString();
    return this.request<Note[]>(`/notes${query ? `?${query}` : ''}`);
  }

  /**
   * Get a single note by ID
   */
  async getNote(noteId: string): Promise<Note> {
    return this.request<Note>(`/notes/${noteId}`);
  }

  /**
   * Search notes
   */
  async searchNotes(query: string): Promise<Note[]> {
    return this.request<Note[]>(`/notes/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Create a new note
   */
  async createNote(data: {
    title: string;
    content?: string;
    notebookId?: string | null;
    contentType?: 'text' | 'drawing' | 'mixed';
    drawingData?: string;
    ocrText?: string;
    autoDeleteAt?: Date;
  }): Promise<Note> {
    return this.request<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a note
   */
  async updateNote(
    noteId: string,
    data: Partial<Omit<Note, 'id' | 'userId' | 'createdAt'>>
  ): Promise<Note> {
    return this.request<Note>(`/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Toggle pin status
   */
  async togglePinNote(noteId: string): Promise<Note> {
    return this.request<Note>(`/notes/${noteId}/pin`, {
      method: 'PATCH',
    });
  }

  /**
   * Delete a note
   */
  async deleteNote(noteId: string): Promise<void> {
    return this.request<void>(`/notes/${noteId}`, {
      method: 'DELETE',
    });
  }

  // ==================== NOTEBOOKS API ====================

  /**
   * Get all notebooks (hierarchical tree)
   */
  async getNotebooks(): Promise<Notebook[]> {
    return this.request<Notebook[]>('/notebooks');
  }

  /**
   * Create a new notebook
   */
  async createNotebook(data: {
    name: string;
    parentId?: string | null;
    color?: string;
    icon?: string;
  }): Promise<Notebook> {
    return this.request<Notebook>('/notebooks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a notebook
   */
  async updateNotebook(
    notebookId: string,
    data: {
      name?: string;
      color?: string;
      icon?: string;
    }
  ): Promise<Notebook> {
    return this.request<Notebook>(`/notebooks/${notebookId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a notebook
   */
  async deleteNotebook(notebookId: string): Promise<void> {
    return this.request<void>(`/notebooks/${notebookId}`, {
      method: 'DELETE',
    });
  }

  // ==================== HEALTH CHECK ====================

  /**
   * Check API health
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; mongodb: string }> {
    return this.request<any>('/health');
  }
}

export default new ApiService();
