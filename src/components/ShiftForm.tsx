// src/components/ShiftForm.tsx
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Engineer, ShiftType } from '../types';
import { getEngineers } from '../api/engineers';
import { createShift } from '../api/shifts';

interface ShiftFormProps {
  onCreated?: () => void;
}

const SHIFT_TYPES: { value: ShiftType; label: string }[] = [
  { value: 'morning', label: 'Mañana' },
  { value: 'afternoon', label: 'Tarde' },
  { value: 'night', label: 'Noche' },
];

export function ShiftForm({ onCreated }: ShiftFormProps) {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [engineersLoading, setEngineersLoading] = useState(true);
  const [engineersError, setEngineersError] = useState<string | null>(null);

  const [engineerId, setEngineerId] = useState('');
  const [date, setDate] = useState('');
  const [shiftType, setShiftType] = useState<ShiftType>('morning');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEngineers = async () => {
      try {
        setEngineersLoading(true);
        setEngineersError(null);
        const data = await getEngineers();
        setEngineers(data);
        if (data.length > 0) {
          setEngineerId(data[0].id);
        }
      } catch (err: any) {
        setEngineersError(err.message || 'Error al cargar ingenieros');
      } finally {
        setEngineersLoading(false);
      }
    };

    loadEngineers();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!engineerId || !date || !shiftType) {
      setError('Ingeniero, fecha y tipo de turno son obligatorios');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await createShift({
        engineer_id: engineerId,
        date,
        shift_type: shiftType,
        notes: notes || undefined,
      });

      setNotes('');
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err.message || 'Error al crear turno');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-slate-700">Crear nuevo turno</h2>

      {engineersError && (
        <p className="text-sm text-red-500">Error: {engineersError}</p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Ingeniero
          </label>
          {engineersLoading ? (
            <p className="text-xs text-slate-500">Cargando ingenieros...</p>
          ) : engineers.length === 0 ? (
            <p className="text-xs text-slate-500">
              No hay ingenieros. Crea uno primero.
            </p>
          ) : (
            <select
              value={engineerId}
              onChange={(e) => setEngineerId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {engineers.map((eng) => (
                <option key={eng.id} value={eng.id}>
                  {eng.name} ({eng.email})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Fecha
            </label>
            <input
              type="date"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Tipo de turno
            </label>
            <select
              value={shiftType}
              onChange={(e) => setShiftType(e.target.value as ShiftType)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {SHIFT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Notas (opcional)
          </label>
          <textarea
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Detalles del turno, contexto, etc."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || engineers.length === 0}
        className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
      >
        {submitting ? 'Creando turno...' : 'Crear turno'}
      </button>
    </form>
  );
}
