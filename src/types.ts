// src/types.ts

export interface Engineer {
    id: string;
    name: string;
    email: string;
    role?: string | null;
    active: boolean;
    created_at: string;
  }
  
  export type ShiftType = 'morning' | 'afternoon' | 'night';
  
  export interface Shift {
    id: string;
    engineer_id: string;
    date: string; // YYYY-MM-DD
    shift_type: ShiftType;
    notes?: string | null;
    created_at: string;
  }
  