import { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import '../components/styles/global.css';

import type { MainLayoutContext, StreamStatus } from './interfaces/main-layout-context.interface';

const STATUS_CONFIG: Record<
  StreamStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  connected: {
    label: 'Stream Live',
    dotClass: 'bg-emerald-500 animate-pulse',
    badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  connecting: {
    label: 'Connecting...',
    dotClass: 'bg-amber-500 animate-ping',
    badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  disconnected: {
    label: 'Offline',
    dotClass: 'bg-rose-500',
    badgeClass: 'border-rose-200 bg-rose-50 text-rose-700',
  },
};

export function useMainLayout() {
  return useOutletContext<MainLayoutContext>();
}

const MainLayout = () => {
  const [streamStatus, setStreamStatus] = useState<StreamStatus>('connecting');
  const [deviceStats, setDeviceStats] = useState({ active: 0, total: 0 });

  const currentStatus = STATUS_CONFIG[streamStatus];

  return (
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
            GPS
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-tight text-slate-900">
              IoT GPS Tracker
            </h1>
            <p className="text-xs text-slate-500">
              Real-Time Telemetry &amp; Device Control
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 sm:flex">
            <span className="text-slate-400">Active:</span>
            <span className="font-semibold text-slate-900">
              {deviceStats.active}
            </span>
            <span className="text-slate-400">/ {deviceStats.total}</span>
          </div>

          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${currentStatus.badgeClass}`}
          >
            <span className={`h-2 w-2 rounded-full ${currentStatus.dotClass}`} />
            <span>{currentStatus.label}</span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="relative min-h-0 flex-1 overflow-hidden">
        <Outlet
          context={
            {
              streamStatus,
              setStreamStatus,
              deviceStats,
              setDeviceStats,
            } satisfies MainLayoutContext
          }
        />
      </main>
    </div>
  );
};

export default MainLayout;
