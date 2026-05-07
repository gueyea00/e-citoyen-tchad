import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api-client';

interface AuthState {
  token: string | null;
  user: any | null;
  isLoading: boolean;
  error: string | null;
  setAuth: (token: string, user: any) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('adminToken') || null,
  user: JSON.parse(localStorage.getItem('adminUser') || 'null'),
  isLoading: false,
  error: null,
  
  setAuth: (token, user) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
    set({ token, user });
  },
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.fetch('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      set({ user: data.user, token: data.token, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    set({ token: null, user: null });
  }
}));
