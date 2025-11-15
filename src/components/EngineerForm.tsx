// src/components/EngineerForm.tsx
import type { FormEvent } from 'react';
import { useState } from 'react';
import { createEngineer } from '../api/engineers';

interface EngineerFormProps {
  onCreated?: () => void;
}

export function EngineerForm({ onCreated }: EngineerFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Nombre y email son obligatorios');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await createEngineer({ name, email, role, active: true });
      setName('');
      setEmail('');
      setRole('');
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err.message || 'Error al crear ingeniero');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-slate-700">
        Crear nuevo ingeniero
      </h2>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Nombre
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Rol
        </label>
        <input
          type="text"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Backend, DevOps, On-call..."
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
      >
        {submitting ? 'Creando...' : 'Crear ingeniero'}
      </button>
    </form>
  );
}
