// src/components/EngineerList.tsx
import { useEffect, useState } from 'react';
import type { Engineer } from '../types';
import { getEngineers, deleteEngineer } from '../api/engineers';

export function EngineerList() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEngineers();
        setEngineers(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar ingenieros');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este ingeniero?')) return;
    try {
      setDeletingId(id);
      await deleteEngineer(id);
      // quitarlo del estado sin recargar todo
      setEngineers((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error al eliminar ingeniero');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p className="text-slate-500">Cargando ingenieros...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (engineers.length === 0) {
    return <p className="text-slate-500">No hay ingenieros todavía.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Rol</th>
            <th className="px-4 py-3">Activo</th>
            <th className="px-4 py-3">Creado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {engineers.map((eng) => (
            <tr key={eng.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{eng.name}</td>
              <td className="px-4 py-3 text-slate-600">{eng.email}</td>
              <td className="px-4 py-3 text-slate-600">{eng.role || '—'}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${eng.active
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                    }`}
                >
                  {eng.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500 text-xs">
                {new Date(eng.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  className="text-xs font-medium text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(eng.id)}
                  disabled={deletingId === eng.id}
                >
                  {deletingId === eng.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
