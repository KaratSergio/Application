import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});


apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => { return config },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        return apiClient(error.config!);
      } catch {
        window.location.href = '/login';
      }
    }

    const responseData = error.response?.data as Record<string, unknown> | undefined;
    const apiError: ApiError = {
      message: typeof responseData?.message === 'string'
        ? responseData.message
        : error.message || 'Network error',
      status: error.response?.status || 500,
      errors: responseData?.errors as Record<string, string[]> | undefined,
    };

    return Promise.reject(apiError);
  }
);