export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}