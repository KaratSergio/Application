import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import type { User } from '../auth/auth.types';
import type { Event } from '../events/events.types';

export const usersApi = {
  getMe: () =>
    apiClient.get<User>(API_ENDPOINTS.USERS.ME),

  getMyEvents: () =>
    apiClient.get<Event[]>(API_ENDPOINTS.USERS.ME_EVENTS),

  getMyParticipations: () =>
    apiClient.get<Event[]>(API_ENDPOINTS.USERS.ME_PARTICIPATIONS),

  getUserById: (id: string) =>
    apiClient.get<User>(API_ENDPOINTS.USERS.DETAIL(id)),
};