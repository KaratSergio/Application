import { useCallback } from 'react';
import { authApi } from '../auth/auth.api';
import { useAuthStore } from '../store/authStore';
import type { LoginCredentials, RegisterCredentials } from '../auth/auth.types';
import type { ApiError } from '../api/client';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setLoading,
    setError,
    logout: storeLogout,
    clearError
  } = useAuthStore();

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    clearError();

    try {
      const response = await authApi.login(credentials);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError, clearError]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setLoading(true);
    clearError();

    try {
      const response = await authApi.register(credentials);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError, clearError]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Logout error:', apiError.message);
    } finally {
      storeLogout();
    }
  }, [storeLogout]);

  const checkAuth = useCallback(async () => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.data) {
        setUser(response.data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [setUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
  };
};