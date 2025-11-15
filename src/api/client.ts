// src/api/client.ts
import { API_URL } from '../config';

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error (${res.status}): ${text || res.statusText}`);
  }

  // Si la respuesta es 204 No Content, devolvemos undefined
  if (res.status === 204) {
    return undefined as T;
  }

  // Algunas APIs devuelven 200 pero sin body
  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
