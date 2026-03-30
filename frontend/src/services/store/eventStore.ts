import { create } from 'zustand';
import { eventsApi } from '../events/events.api';
import { usersApi } from '../users/users.api';
import type { Event, CreateEventDto, UpdateEventDto, EventFilters } from '../events/events.types';
import type { ApiError } from '../api/client';

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  userEvents: Event[];
  isLoading: boolean;
  error: string | null;

  fetchPublicEvents: (filters?: EventFilters) => Promise<Event[]>;
  fetchEventById: (id: string) => Promise<Event>;
  fetchMyEvents: () => Promise<Event[]>;
  createEvent: (data: CreateEventDto) => Promise<Event>;
  updateEvent: (id: string, data: UpdateEventDto) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  joinEvent: (id: string) => Promise<void>;
  leaveEvent: (id: string) => Promise<void>;
  clearCurrentEvent: () => void;
  clearError: () => void;

  setEvents: (events: Event[]) => void;
  setCurrentEvent: (event: Event | null) => void;
  setUserEvents: (events: Event[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updateEventInLists: (updatedEvent: Event) => void;
  removeEventFromLists: (eventId: string) => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  currentEvent: null,
  userEvents: [],
  isLoading: false,
  error: null,

  setEvents: (events) => set({ events }),
  setCurrentEvent: (currentEvent) => set({ currentEvent }),
  setUserEvents: (userEvents) => set({ userEvents }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  updateEventInLists: (updatedEvent) => {
    set(state => ({
      events: state.events.map(e => e.id === updatedEvent.id ? updatedEvent : e),
      userEvents: state.userEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e),
      currentEvent: state.currentEvent?.id === updatedEvent.id ? updatedEvent : state.currentEvent,
    }));
  },

  removeEventFromLists: (eventId) => {
    set(state => ({
      events: state.events.filter(e => e.id !== eventId),
      userEvents: state.userEvents.filter(e => e.id !== eventId),
      currentEvent: state.currentEvent?.id === eventId ? null : state.currentEvent,
    }));
  },

  clearCurrentEvent: () => set({ currentEvent: null }),
  clearError: () => set({ error: null }),

  // API Actions
  fetchPublicEvents: async (filters?: EventFilters) => {
    const { setLoading, setError, setEvents } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await eventsApi.getPublicEvents(filters);
      const eventsData = response.data.data || [];
      setEvents(eventsData);
      return eventsData;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  },

  fetchEventById: async (id: string) => {
    const { setLoading, setError, setCurrentEvent } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await eventsApi.getEventById(id);
      setCurrentEvent(response.data);
      return response.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  },

  fetchMyEvents: async () => {
    const { setLoading, setError, setUserEvents } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await usersApi.getMyEvents();
      setUserEvents(response.data);
      return response.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  },

  createEvent: async (data: CreateEventDto) => {
    const { setLoading, setError, fetchPublicEvents } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await eventsApi.createEvent(data);
      await fetchPublicEvents();
      return response.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  },

  updateEvent: async (id: string, data: UpdateEventDto) => {
    const { setLoading, setError, updateEventInLists } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await eventsApi.updateEvent(id, data);
      updateEventInLists(response.data);
      return response.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  },

  deleteEvent: async (id: string) => {
    const { setLoading, setError, removeEventFromLists } = get();
    setLoading(true);
    setError(null);

    try {
      await eventsApi.deleteEvent(id);
      removeEventFromLists(id);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  },

  joinEvent: async (id: string) => {
    const { setLoading, setError, updateEventInLists } = get();
    setLoading(true);
    setError(null);

    try {
      await eventsApi.joinEvent(id);
      const response = await eventsApi.getEventById(id);
      updateEventInLists(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  },

  leaveEvent: async (id: string) => {
    const { setLoading, setError, updateEventInLists } = get();
    setLoading(true);
    setError(null);

    try {
      await eventsApi.leaveEvent(id);
      const response = await eventsApi.getEventById(id);
      updateEventInLists(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  },
}));