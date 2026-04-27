import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  credits: number;
  is_active: boolean;
  invite_code?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: 'mock-dev-token-12345',
      user: {
        id: 1,
        username: 'admin_user',
        email: 'admin@example.com',
        credits: 9999,
        is_active: true,
        tier: 'pro'
      },
      setAuth: (token, user) => set({ token, user }),
      logout: () => {
        set({ token: null, user: null });
        window.location.href = '/';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
