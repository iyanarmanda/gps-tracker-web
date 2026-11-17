export interface AuthUser {
  username: string;
}

export interface AuthResponse {
  authenticated: boolean;
  user?: AuthUser;
}

