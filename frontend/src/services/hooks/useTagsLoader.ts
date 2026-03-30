import { useEffect } from 'react';
import { useTagStore } from '../store/tagStore';
import { tagsApi } from '../tags/tags.api';
import type { ApiError } from '../api/client';

export const useTagsLoader = () => {
  const { tags, setTags, isLoading, setLoading, setError } = useTagStore();

  useEffect(() => {
    const loadTags = async () => {
      if (tags.length === 0 && !isLoading) {
        setLoading(true);
        try {
          const response = await tagsApi.getAllTags();
          setTags(response.data);
        } catch (err) {
          setError((err as ApiError).message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTags();
  }, [tags.length, isLoading, setTags, setLoading, setError]);

  return { tags, isLoading };
};