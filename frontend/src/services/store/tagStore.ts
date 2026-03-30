import { create } from 'zustand';
import type { Tag } from '../tags/tags.types';

interface TagState {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;

  setTags: (tags: Tag[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTagStore = create<TagState>((set) => ({
  tags: [],
  isLoading: false,
  error: null,

  setTags: (tags) => set({ tags }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));