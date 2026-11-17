import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { fetchCurrentUser, loginUser, logoutUser } from '@/services/auth.api';
import { AuthContext } from './auth.context';

import type { AuthUser } from '@/services/interfaces/auth.interface';
import type { LoginPayload } from '@/services/interfaces/login.interface';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchCurrentUser()
      .then((res) => {
        if (!isMounted) return;
        setUser(res.authenticated && res.user ? res.user : null);
      })
      .catch(() => {
        if (!isMounted) return;
        setUser(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await loginUser(payload);
    if (res.authenticated && res.user) {
      setUser(res.user);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
