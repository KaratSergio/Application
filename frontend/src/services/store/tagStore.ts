import { create } from 'zustand';
import type { Tag } from '../tags/tags.types';

interface TagState {
  tags: Tag[];
  selectedTags: Tag[];
  isLoading: boolean;
  error: string | null;

  setTags: (tags: Tag[]) => void;
  setSelectedTags: (tags: Tag[]) => void;
  addSelectedTag: (tag: Tag) => void;
  removeSelectedTag: (tagId: string) => void;
  clearSelectedTags: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTagStore = create<TagState>((set) => ({
  tags: [],
  selectedTags: [],
  isLoading: false,
  error: null,

  setTags: (tags) => set({ tags }),

  setSelectedTags: (selectedTags) => set({ selectedTags }),

  addSelectedTag: (tag) => set((state) => ({
    selectedTags: [...state.selectedTags, tag]
  })),

  removeSelectedTag: (tagId) => set((state) => ({
    selectedTags: state.selectedTags.filter(t => t.id !== tagId)
  })),

  clearSelectedTags: () => set({ selectedTags: [] }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));