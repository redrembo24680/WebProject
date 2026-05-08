import { useState, useCallback, useEffect } from 'react';
import { notesService, Note } from '../services/authService';

interface UseNotesReturn {
  notes: Note[];
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  createNote: (title: string, content: string, file?: File) => Promise<Note>;
  deleteNote: (id: number) => Promise<void>;
  editNote: (id: number, title?: string, content?: string, file?: File) => Promise<Note>;
}

export const useNotes = (): UseNotesReturn => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notesService.getAll();
      setNotes(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch notes';
      setError(errorMessage);
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(
    async (title: string, content: string, file?: File): Promise<Note> => {
      setError(null);
      try {
        const response = await notesService.create(title, content, file);
        const newNote = response.data;
        setNotes((prevNotes) => [newNote, ...prevNotes]);
        return newNote;
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || 'Failed to create note';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const deleteNote = useCallback(async (id: number) => {
    setError(null);
    try {
      await notesService.delete(id);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete note';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const editNote = useCallback(async (id: number, title?: string, content?: string, file?: File): Promise<Note> => {
    setError(null);
    try {
      const response = await notesService.update(id, title, content, file);
      const updated = response.data;
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      return updated;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to update note';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    deleteNote,
    editNote,
  };
};
