// Shared API Client for Digital Estate & Financial Closure Assistant
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('estate_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/v1${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errText = await res.text();
      let errMsg = errText;
      try {
        const parsed = JSON.parse(errText);
        errMsg = parsed.detail || parsed.message || errText;
      } catch (e) {
        // fallback
      }
      throw new Error(errMsg);
    }

    return await res.json();
  } catch (error: any) {
    console.warn(`[API Call Warning for /api/v1${path}]:`, error.message);
    throw error;
  }
}
