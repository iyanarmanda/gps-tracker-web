import { useEffect, useState } from 'react';
import { DeviceCard } from '@/components/DeviceCard';
import { TrackerMap } from '@/components/TrackerMap';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { IntervalOptions } from '@/constants/interval.constant';
import { useMainLayout } from '@/layouts/useMainLayout';
import { fetchDevices, getDeviceStreamUrl, sendDeviceCommand } from '@/services/devices.api';

import type { DeviceStatusStreamEvent, DeviceTelemetryStreamEvent } from '@/services/interfaces/device-stream.interface';
import type { Device } from '@/services/interfaces/device.interface';

const Home = () => {
  const { setDeviceStats, setStreamStatus } = useMainLayout();

  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedEspId, setSelectedEspId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submittingIds, setSubmittingIds] = useState<Record<string, boolean>>(
    {},
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchDevices()
      .then((data) => {
        if (!isMounted) return;
        setErrorMessage(null);
        setDevices(data);
        setSelectedEspId((prev) => prev ?? data[0]?.espId ?? null);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to load devices',
        );
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const data = await fetchDevices();
      setDevices(data);
      setSelectedEspId((prev) => prev ?? data[0]?.espId ?? null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to load devices',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const eventSource = new EventSource(getDeviceStreamUrl(), {
      withCredentials: true,
    });

    eventSource.onopen = () => {
      setStreamStatus('connected');
    };

    eventSource.onerror = () => {
      setStreamStatus(
        eventSource.readyState === EventSource.CLOSED
          ? 'disconnected'
          : 'connecting',
      );
    };

    eventSource.addEventListener('telemetry', (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as DeviceTelemetryStreamEvent;

      setDevices((prev) =>
        prev.map((item) =>
          item.espId === payload.espId
            ? {
                ...item,
                isActive: payload.active,
                location: {
                  lat: payload.lat,
                  lng: payload.lng,
                  speed: payload.speed,
                  satellites: payload.satellites,
                  updatedAt: payload.updatedAt,
                },
              }
            : item,
        ),
      );
    });

    eventSource.addEventListener('status', (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as DeviceStatusStreamEvent;

      setDevices((prev) =>
        prev.map((item) =>
          item.espId === payload.espId
            ? {
                ...item,
                isActive: payload.active,
                interval: payload.interval,
              }
            : item,
        ),
      );
    });

    return () => {
      eventSource.close();
      setStreamStatus('disconnected');
    };
  }, [setStreamStatus]);

  useEffect(() => {
    const activeCount = devices.filter((d) => d.isActive).length;
    setDeviceStats({ active: activeCount, total: devices.length });
  }, [devices, setDeviceStats]);

  const handleToggleActive = async (device: Device) => {
    const nextActive = !device.isActive;
    setSubmittingIds((prev) => ({ ...prev, [device.espId]: true }));
    setErrorMessage(null);

    try {
      const res = await sendDeviceCommand(device.espId, {
        active: nextActive,
      });

      setDevices((prev) =>
        prev.map((item) =>
          item.espId === device.espId
            ? {
                ...item,
                isActive: res.device.isActive,
                interval: res.device.interval,
                activatedAt: res.device.activatedAt,
              }
            : item,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to toggle device',
      );
    } finally {
      setSubmittingIds((prev) => ({ ...prev, [device.espId]: false }));
    }
  };

  const handleChangeInterval = async (
    device: Device,
    nextInterval: IntervalOptions,
  ) => {
    if (nextInterval === device.interval) return;

    setSubmittingIds((prev) => ({ ...prev, [device.espId]: true }));
    setErrorMessage(null);

    try {
      const res = await sendDeviceCommand(device.espId, {
        active: device.isActive,
        interval: nextInterval,
      });

      setDevices((prev) =>
        prev.map((item) =>
          item.espId === device.espId
            ? {
                ...item,
                isActive: res.device.isActive,
                interval: res.device.interval,
              }
            : item,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to update interval',
      );
    } finally {
      setSubmittingIds((prev) => ({ ...prev, [device.espId]: false }));
    }
  };

  return (
    <div className="flex h-full w-full flex-col lg:flex-row">
      <section className="relative min-h-0 flex-1 bg-muted/40">
        <TrackerMap
          devices={devices}
          selectedEspId={selectedEspId}
          onSelectDevice={setSelectedEspId}
        />
      </section>

      <aside className="flex h-80 w-full shrink-0 flex-col border-t bg-background lg:h-full lg:w-96 lg:border-t-0 lg:border-l">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Registered Devices ({devices.length})
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isLoading}
            onClick={() => void handleRefresh()}
            className="h-7 px-2 text-xs"
          >
            Refresh
          </Button>
        </div>

        {errorMessage && (
          <div className="border-b p-3">
            <Alert variant="destructive" className="py-2">
              <AlertDescription className="text-xs">
                {errorMessage}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-2.5">
              <Skeleton className="h-28 w-full rounded-lg" />
              <Skeleton className="h-28 w-full rounded-lg" />
            </div>
          ) : devices.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No devices registered in database.
            </p>
          ) : (
            devices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                isSelected={selectedEspId === device.espId}
                isSubmitting={Boolean(submittingIds[device.espId])}
                onSelect={setSelectedEspId}
                onToggleActive={(d) => void handleToggleActive(d)}
                onChangeInterval={(d, val) => void handleChangeInterval(d, val)}
              />
            ))
          )}
        </div>
      </aside>
    </div>
  );
};

export default Home;
