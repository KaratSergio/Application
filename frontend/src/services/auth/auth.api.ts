import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import type {
  User,
  AuthResponse,
  TokenResponse,
  LogoutResponse,
  LoginCredentials,
  RegisterCredentials,
} from './auth.types';

export const authApi = {
  register: (credentials: RegisterCredentials) =>
    apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, credentials),

  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials),

  logout: () =>
    apiClient.post<LogoutResponse>(API_ENDPOINTS.AUTH.LOGOUT),

  refresh: (refreshToken: string) =>
    apiClient.post<TokenResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }),

  getCurrentUser: () =>
    apiClient.get<User>(API_ENDPOINTS.AUTH.ME),
};