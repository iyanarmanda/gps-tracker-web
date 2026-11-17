import { API_BASE_URL } from '@/constants/api.constant';

import type { AuthResponse } from './interfaces/auth.interface';
import type { LoginPayload } from './interfaces/login.interface';

export async function fetchCurrentUser(): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/v1/auth`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 401) {
    return { authenticated: false };
  }

  if (!res.ok) {
    throw new Error('Failed to verify session');
  }

  return (await res.json()) as AuthResponse;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(errorData?.message)
      ? errorData.message[0]
      : errorData?.message;
    throw new Error(message ?? 'Username or password invalid');
  }

  return (await response.json()) as AuthResponse;
}

export async function logoutUser(): Promise<void> {
  await fetch(`${API_BASE_URL}/v1/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
