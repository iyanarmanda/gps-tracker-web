import { createContext, useContext } from 'react';

import type { AuthUser } from '@/services/interfaces/auth.interface';
import type { LoginPayload } from '@/services/interfaces/login.interface';

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
