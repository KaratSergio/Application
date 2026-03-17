import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import type { Tag, TagFilters } from './tags.types';

export const tagsApi = {
  getAllTags: (filters?: TagFilters) =>
    apiClient.get<Tag[]>(API_ENDPOINTS.TAGS.BASE, { params: filters }),

  getTagById: (id: string) =>
    apiClient.get<Tag>(API_ENDPOINTS.TAGS.DETAIL(id)),

  createTag: (name: string) =>
    apiClient.post<Tag>(API_ENDPOINTS.TAGS.CREATE, { name }),

  deleteTag: (id: string) =>
    apiClient.delete<void>(API_ENDPOINTS.TAGS.DELETE(id)),
};