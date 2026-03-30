import { create } from 'zustand';
import { tagsApi } from '../tags/tags.api';
import type { Tag } from '../tags/tags.types';
import type { ApiError } from '../api/client';

interface TagState {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;

  fetchTags: () => Promise<Tag[]>;
  clearError: () => void;

  setTags: (tags: Tag[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  isLoading: false,
  error: null,

  setTags: (tags) => set({ tags }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  fetchTags: async () => {
    const { setLoading, setError, setTags } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await tagsApi.getAllTags();
      setTags(response.data);
      return response.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  },
}));