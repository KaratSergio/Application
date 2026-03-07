import { useCallback } from 'react';
import { eventsApi } from '../events/events.api';
import { usersApi } from '../users/users.api';
import { useEventStore } from '../../store/eventStore';
import type { CreateEventDto, UpdateEventDto, EventFilters } from '../events/events.types';
import type { ApiError } from '../api/client';

export const useEvents = () => {
  const {
    events,
    currentEvent,
    userEvents,
    isLoading,
    error,
    setEvents,
    setCurrentEvent,
    setUserEvents,
    setLoading,
    setError,
    updateEventInLists,
    removeEventFromLists,
    clearCurrentEvent,
    clearError
  } = useEventStore();

  const fetchPublicEvents = useCallback(async (filters?: EventFilters) => {
    setLoading(true);
    clearError();

    try {
      const response = await eventsApi.getPublicEvents(filters);
      setEvents(response.data);
      return response.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [setEvents, setLoading, setError, clearError]);

  const fetchEventById = useCallback(async (id: string) => {
    setLoading(true);
    clearError();

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
  }, [setCurrentEvent, setLoading, setError, clearError]);

  const fetchMyEvents = useCallback(async () => {
    setLoading(true);
    clearError();

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
  }, [setUserEvents, setLoading, setError, clearError]);

  const createEvent = useCallback(async (data: CreateEventDto) => {
    setLoading(true);
    clearError();

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
  }, [fetchPublicEvents, setLoading, setError, clearError]);

  const updateEvent = useCallback(async (id: string, data: UpdateEventDto) => {
    setLoading(true);
    clearError();

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
  }, [updateEventInLists, setLoading, setError, clearError]);

  const deleteEvent = useCallback(async (id: string) => {
    setLoading(true);
    clearError();

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
  }, [removeEventFromLists, setLoading, setError, clearError]);

  const joinEvent = useCallback(async (id: string) => {
    setLoading(true);
    clearError();

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
  }, [updateEventInLists, setLoading, setError, clearError]);

  const leaveEvent = useCallback(async (id: string) => {
    setLoading(true);
    clearError();

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
  }, [updateEventInLists, setLoading, setError, clearError]);

  return {
    // Data from store
    events,
    currentEvent,
    userEvents,
    isLoading,
    error,

    // Actions
    fetchPublicEvents,
    fetchEventById,
    fetchMyEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
    clearCurrentEvent,
    clearError,
  };
};