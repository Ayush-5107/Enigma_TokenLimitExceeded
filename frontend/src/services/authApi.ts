import { apiFetch } from './api';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  phone?: string;
  created_at?: string;
}

export const authApi = {
  async register(data: any): Promise<User> {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: any): Promise<{ access_token: string; user: User }> {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async me(): Promise<User> {
    return apiFetch('/auth/me');
  }
};
