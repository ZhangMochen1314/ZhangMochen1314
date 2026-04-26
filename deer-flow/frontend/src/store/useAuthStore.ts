import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  credits: number;
  is_active: boolean;
  role: string;
  my_invite_code?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      fetchUser: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const res = await fetch('/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            set({ user: userData });
          } else if (res.status === 401) {
            set({ token: null, user: null });
          }
        } catch (error) {
          console.error("Failed to fetch user info", error);
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
