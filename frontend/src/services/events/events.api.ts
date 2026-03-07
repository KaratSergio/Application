import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import type {
  Event,
  CreateEventDto,
  UpdateEventDto,
  EventFilters,
  ParticipantResponse,
  ParticipantsCount,
  ParticipationStatus,
} from './events.types';

export const eventsApi = {
  getPublicEvents: (filters?: EventFilters) =>
    apiClient.get<Event[]>(API_ENDPOINTS.EVENTS.BASE, { params: filters }),

  getEventById: (id: string) =>
    apiClient.get<Event>(API_ENDPOINTS.EVENTS.DETAIL(id)),

  createEvent: (data: CreateEventDto) =>
    apiClient.post<Event>(API_ENDPOINTS.EVENTS.CREATE, data),

  updateEvent: (id: string, data: UpdateEventDto) =>
    apiClient.patch<Event>(API_ENDPOINTS.EVENTS.UPDATE(id), data),

  deleteEvent: (id: string) =>
    apiClient.delete<void>(API_ENDPOINTS.EVENTS.DELETE(id)),

  getParticipants: (eventId: string) =>
    apiClient.get<ParticipantResponse[]>(API_ENDPOINTS.EVENTS.PARTICIPANTS.ALL(eventId)),

  joinEvent: (eventId: string) =>
    apiClient.post<void>(API_ENDPOINTS.EVENTS.PARTICIPANTS.JOIN(eventId)),

  leaveEvent: (eventId: string) =>
    apiClient.delete<void>(API_ENDPOINTS.EVENTS.PARTICIPANTS.LEAVE(eventId)),

  checkParticipation: (eventId: string) =>
    apiClient.get<ParticipationStatus>(API_ENDPOINTS.EVENTS.PARTICIPANTS.CHECK(eventId)),

  getParticipantsCount: (eventId: string) =>
    apiClient.get<ParticipantsCount>(API_ENDPOINTS.EVENTS.PARTICIPANTS.COUNT(eventId)),
};