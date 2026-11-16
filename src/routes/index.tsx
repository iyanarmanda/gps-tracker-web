import { useCallback, useEffect, useState } from 'react';
import { DeviceCard } from '../components/ui/DeviceCard';
import { useMainLayout } from '../layouts/MainLayout';
import { fetchDevices, sendDeviceCommand } from '../services/devices.api';

import type { Device } from '../services/interfaces/device.interface';

const Home = () => {
  const { setDeviceStats } = useMainLayout();

  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedEspId, setSelectedEspId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submittingIds, setSubmittingIds] = useState<Record<string, boolean>>(
    {},
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDevices = useCallback(async () => {
    try {
      setErrorMessage(null);
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
  }, []);

  useEffect(() => {
    void loadDevices();
  }, [loadDevices]);

  // Sinkronisasi statistik header pada MainLayout setiap kali state devices berubah
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

  const handleChangeInterval = async (device: Device, nextInterval: number) => {
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
      {/* Slot Kanvas Peta */}
      <section className="relative flex min-h-0 flex-1 items-center justify-center bg-slate-200/70">
        <p className="rounded-md border border-slate-300 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600">
          Map Canvas Area {selectedEspId ? `(Selected: ${selectedEspId})` : ''}
        </p>
      </section>

      {/* Sidebar Daftar & Kontrol Device */}
      <aside className="flex h-80 w-full shrink-0 flex-col border-t border-slate-200 bg-white lg:h-full lg:w-96 lg:border-t-0 lg:border-l">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Registered Devices ({devices.length})
          </h2>
          <button
            type="button"
            onClick={() => void loadDevices()}
            className="text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Refresh
          </button>
        </div>

        {errorMessage && (
          <div className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700">
            {errorMessage}
          </div>
        )}

        <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
          {isLoading ? (
            <p className="text-center text-xs text-slate-400">
              Loading devices...
            </p>
          ) : devices.length === 0 ? (
            <p className="text-center text-xs text-slate-400">
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
