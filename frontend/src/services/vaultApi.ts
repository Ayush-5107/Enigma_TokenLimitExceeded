import { apiFetch } from './api';

export interface VaultEntry {
  id: string;
  owner_id: string;
  title: string;
  category: 'document' | 'account' | 'credential' | 'note' | 'key' | 'contact';
  institution?: string;
  access_level: 'private' | 'shared' | 'release_on_verification';
  deadman_trigger_days: number;
  metadata_json: Record<string, any>;
  content?: string;
  created_at: string;
  updated_at: string;
}

export const vaultApi = {
  async getEntries(): Promise<VaultEntry[]> {
    return apiFetch('/vault/entries');
  },

  async createEntry(data: {
    title: string;
    category: string;
    content: string;
    institution?: string;
    access_level?: string;
    deadman_trigger_days?: number;
    metadata?: Record<string, any>;
  }): Promise<VaultEntry> {
    return apiFetch('/vault/entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateEntry(id: string, data: {
    title?: string;
    category?: string;
    content?: string;
    institution?: string;
    access_level?: string;
    deadman_trigger_days?: number;
  }): Promise<VaultEntry> {
    return apiFetch(`/vault/entries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteEntry(id: string): Promise<any> {
    return apiFetch(`/vault/entries/${id}`, {
      method: 'DELETE',
    });
  }
};
