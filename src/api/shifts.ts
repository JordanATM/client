// src/api/shifts.ts
import { apiFetch } from './client';
import type { Shift, ShiftType } from '../types';

export interface GetShiftsParams {
  fromDate?: string;     // 'YYYY-MM-DD'
  toDate?: string;       // 'YYYY-MM-DD'
  engineer_id?: string;
}

export interface CreateShiftPayload {
  engineer_id: string;
  date: string;          // 'YYYY-MM-DD'
  shift_type: ShiftType;
  notes?: string;
}

export interface UpdateShiftPayload {
  engineer_id?: string;
  date?: string;
  shift_type?: ShiftType;
  notes?: string | null;
}

export async function getShifts(params: GetShiftsParams = {}): Promise<Shift[]> {
  const query = new URLSearchParams();

  if (params.fromDate) query.set('fromDate', params.fromDate);
  if (params.toDate) query.set('toDate', params.toDate);
  if (params.engineer_id) query.set('engineer_id', params.engineer_id);

  const qs = query.toString();
  const path = qs ? `/shifts?${qs}` : '/shifts';

  return apiFetch<Shift[]>(path);
}

export async function createShift(payload: CreateShiftPayload): Promise<Shift> {
  return apiFetch<Shift>('/shifts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateShift(id: string, payload: UpdateShiftPayload): Promise<Shift> {
  return apiFetch<Shift>(`/shifts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteShift(id: string): Promise<void> {
    await apiFetch<void>(`/shifts/${id}`, {
      method: 'DELETE',
    });
  }
  
