// src/components/ShiftList.tsx
import { useEffect, useState } from 'react';
import type { Engineer, Shift } from '../types';
import { getEngineers } from '../api/engineers';
import { deleteShift, getShifts } from '../api/shifts';

interface ShiftListProps {
  refreshKey?: number; // para forzar reload desde el padre
}

export function ShiftList({ refreshKey = 0 }: ShiftListProps) {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [engineersLoading, setEngineersLoading] = useState(true);

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedEngineerId, setSelectedEngineerId] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Cargar ingenieros para el filtro
  useEffect(() => {
    const loadEngineers = async () => {
      try {
        setEngineersLoading(true);
        const data = await getEngineers();
        setEngineers(data);
      } catch (err) {
        // no es crítico, así que no mostramos error grande
        console.error('Error loading engineers for shifts filter', err);
      } finally {
        setEngineersLoading(false);
      }
    };
    loadEngineers();
  }, []);

  // Cargar turnos
  const loadShifts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getShifts({
        engineer_id: selectedEngineerId || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      });
      setShifts(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los turnos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]); // se recarga cuando cambie refreshKey

  const handleApplyFilters = () => {
    loadShifts();
  };

  const handleClearFilters = () => {
    setSelectedEngineerId('');
    setFromDate('');
    setToDate('');
    // después de limpiar, recargo
    setTimeout(() => {
      loadShifts();
    }, 0);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este turno?')) return;
    try {
      setDeletingId(id);
      await deleteShift(id);
      // quitarlo del estado sin recargar todo
      setShifts((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error al eliminar turno');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-600 mb-1">
            Ingeniero
          </label>
          <select
            value={selectedEngineerId}
            onChange={(e) => setSelectedEngineerId(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-w-[180px]"
          >
            <option value="">Todos</option>
            {engineers.map((eng) => (
              <option key={eng.id} value={eng.id}>
                {eng.name}
              </option>
            ))}
          </select>
          {engineersLoading && (
            <span className="mt-1 text-[10px] text-slate-400">
              Cargando ingenieros...
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-600 mb-1">
            Desde
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-600 mb-1">
            Hasta
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-2 ml-auto">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Aplicar filtros
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-slate-500 text-sm">Cargando turnos...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">Error: {error}</p>
      ) : shifts.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No hay turnos para los filtros seleccionados.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Turno</th>
                <th className="px-4 py-3">Ingeniero</th>
                <th className="px-4 py-3">Notas</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shifts.map((shift) => {
                const engineer = engineers.find(
                  (e) => e.id === shift.engineer_id,
                );
                const shiftLabel =
                  shift.shift_type === 'morning'
                    ? 'Mañana'
                    : shift.shift_type === 'afternoon'
                    ? 'Tarde'
                    : 'Noche';

                return (
                  <tr key={shift.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-800">
                      {shift.date}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                        {shiftLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {engineer ? engineer.name : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                      {shift.notes || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="text-xs font-medium text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(shift.id)}
                        disabled={deletingId === shift.id}
                      >
                        {deletingId === shift.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
