import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import '@/components/styles/global.css';

import type { MainLayoutContext, StreamStatus } from './interfaces/main-layout-context.interface';

const STATUS_CONFIG: Record<
  StreamStatus,
  {
    label: string;
    dotClass: string;
    variant: 'outline' | 'secondary' | 'destructive';
    badgeClass?: string;
  }
> = {
  connected: {
    label: 'Stream',
    dotClass: 'bg-emerald-500 animate-pulse',
    variant: 'outline',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  },
  connecting: {
    label: 'Connecting...',
    dotClass: 'bg-amber-500 animate-ping',
    variant: 'secondary',
  },
  disconnected: {
    label: 'Offline',
    dotClass: 'bg-white',
    variant: 'destructive',
  },
};

const MainLayout = () => {
  const [streamStatus, setStreamStatus] = useState<StreamStatus>('connecting');
  const [deviceStats, setDeviceStats] = useState({ active: 0, total: 0 });

  const currentStatus = STATUS_CONFIG[streamStatus];

  return (
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-muted/30 text-foreground">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-sm font-semibold leading-tight">
              GPS Tracker
            </h1>
            <p className="text-xs text-muted-foreground">
              Real-Time Telemetry & Device Control
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2.5">
          <Badge
            variant="secondary"
            className="hidden gap-1.5 font-normal sm:inline-flex"
          >
            <span className="text-muted-foreground">Active:</span>
            <span className="font-semibold text-foreground">
              {deviceStats.active}
            </span>
            <span className="text-muted-foreground">/ {deviceStats.total}</span>
          </Badge>

          <Badge
            variant={currentStatus.variant}
            className={`gap-2 ${currentStatus.badgeClass ?? ''}`}
          >
            <span className={`h-2 w-2 rounded-full ${currentStatus.dotClass}`} />
            <span>{currentStatus.label}</span>
          </Badge>
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
