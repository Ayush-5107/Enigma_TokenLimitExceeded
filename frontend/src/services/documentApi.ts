import { apiFetch } from './api';

export interface DocumentItem {
  id: string;
  estate_id: string;
  title: string;
  filename: string;
  file_type: string;
  file_size_bytes: number;
  status: 'uploaded' | 'processing_tee' | 'extracted' | 'confirmed' | 'error';
  upload_date: string;
}

export const documentApi = {
  async uploadDocument(estateId: string, file: File, title?: string): Promise<DocumentItem> {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const formData = new FormData();
    formData.append('estate_id', estateId);
    formData.append('file', file);
    if (title) formData.append('title', title);

    const token = localStorage.getItem('estate_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/api/v1/documents`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  },

  async getDocument(id: string): Promise<DocumentItem> {
    return apiFetch(`/documents/${id}`);
  },

  async getStatus(id: string): Promise<any> {
    return apiFetch(`/documents/${id}/status`);
  }
};
