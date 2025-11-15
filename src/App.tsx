// src/App.tsx
import { useState } from 'react';
import { EngineerList } from './components/EngineerList';
import { EngineerForm } from './components/EngineerForm';
import { ShiftForm } from './components/ShiftForm';
import { ShiftList } from './components/ShiftList';

function App() {
  const [engineersRefreshKey, setEngineersRefreshKey] = useState(0);
  const [shiftsRefreshKey, setShiftsRefreshKey] = useState(0);

  const handleEngineerCreated = () => {
    setEngineersRefreshKey((k) => k + 1);
  };

  const handleShiftCreated = () => {
    setShiftsRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-slate-800">
            Turnos de ingenieros
          </h1>
          <span className="text-xs text-slate-500">
            Panel de administración
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        {/* Sección de formularios */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <EngineerForm onCreated={handleEngineerCreated} />
          </div>
          <div className="space-y-4">
            <ShiftForm onCreated={handleShiftCreated} />
          </div>
        </section>

        {/* Sección de listados */}
        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">
                Ingenieros
              </h2>
              <button
                onClick={() => setEngineersRefreshKey((k) => k + 1)}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                Refrescar
              </button>
            </div>
            <div key={engineersRefreshKey}>
              <EngineerList />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">
                Turnos
              </h2>
              <button
                onClick={() => setShiftsRefreshKey((k) => k + 1)}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                Refrescar
              </button>
            </div>
            <div key={shiftsRefreshKey}>
              <ShiftList />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
