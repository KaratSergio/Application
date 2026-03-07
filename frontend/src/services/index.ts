export { apiClient } from './api/client';
export { API_ENDPOINTS } from './api/endpoints';
export type { ApiError } from './api/client';

// Auth
export { authApi } from './auth/auth.api';
export type {
  LoginCredentials,
  RegisterCredentials,
  User,
  AuthResponse,
} from './auth/auth.types';

// Events
export { eventsApi } from './events/events.api';
export type {
  Event,
  CreateEventDto,
  UpdateEventDto,
  EventFilters,
} from './events/events.types';

// Users
export { usersApi } from './users/users.api';