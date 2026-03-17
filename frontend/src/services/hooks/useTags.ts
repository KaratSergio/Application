import { useCallback, useEffect } from 'react';
import { tagsApi } from '../tags/tags.api';
import { useTagStore } from '../store/tagStore';
import type { ApiError } from '../api/client';
import type { TagFilters } from '../tags/tags.types';

export const useTags = () => {
  const {
    tags,
    selectedTags,
    isLoading,
    error,
    setTags,
    setSelectedTags,
    addSelectedTag,
    removeSelectedTag,
    clearSelectedTags,
    setLoading,
    setError,
  } = useTagStore();

  const fetchTags = useCallback(async (filters?: TagFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await tagsApi.getAllTags(filters);
      setTags(response.data);
      return response.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [setTags, setLoading, setError]);

  const createTag = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await tagsApi.createTag(name);
      await fetchTags();
      return response.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [fetchTags, setLoading, setError]);

  const deleteTag = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await tagsApi.deleteTag(id);
      await fetchTags();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [fetchTags, setLoading, setError]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    selectedTags,
    isLoading,
    error,
    fetchTags,
    createTag,
    deleteTag,
    setSelectedTags,
    addSelectedTag,
    removeSelectedTag,
    clearSelectedTags,
  };
};