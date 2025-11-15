// src/api/engineers.ts
import { apiFetch } from './client';
import type { Engineer } from '../types';

export interface CreateEngineerPayload {
  name: string;
  email: string;
  role?: string;
  active?: boolean;
}

export async function getEngineers(): Promise<Engineer[]> {
  return apiFetch<Engineer[]>('/engineers');
}

export async function createEngineer(payload: CreateEngineerPayload): Promise<Engineer> {
  return apiFetch<Engineer>('/engineers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteEngineer(id: string): Promise<void>{
  await apiFetch<void>(`/engineers/${id}`, {
    method: 'DELETE'
  });
}