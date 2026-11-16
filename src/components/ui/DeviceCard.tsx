import { INTERVAL_OPTIONS } from '../../constants/interval.constant';

import type { Device } from '../../services/devices.api';
import type { IntervalOptions } from '../../constants/interval.constant';

interface DeviceCardProps {
  device: Device;
  isSelected: boolean;
  isSubmitting: boolean;
  onSelect: (espId: string) => void;
  onToggleActive: (device: Device) => void;
  onChangeInterval: (device: Device, nextInterval: IntervalOptions) => void;
}

export const DeviceCard = ({
  device,
  isSelected,
  isSubmitting,
  onSelect,
  onToggleActive,
  onChangeInterval,
}: DeviceCardProps) => {
  return (
    <div
      onClick={() => onSelect(device.espId)}
      className={`cursor-pointer rounded-lg border p-3 transition-colors ${
        isSelected
          ? 'border-slate-900 bg-slate-50 shadow-xs'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                device.isActive ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            />
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {device.name}
            </h3>
          </div>
          <p className="mt-0.5 font-mono text-xs text-slate-500">
            {device.espId}
          </p>
        </div>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={(e) => {
            e.stopPropagation();
            onToggleActive(device);
          }}
          className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
            device.isActive
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          {isSubmitting ? '...' : device.isActive ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-1.5 rounded-md bg-slate-100/80 px-2.5 py-1.5 text-[11px] text-slate-600">
        <div>
          <span className="text-slate-400">Coord: </span>
          {device.location ? (
            <span className="font-mono text-slate-800">
              {device.location.lat.toFixed(5)}, {device.location.lng.toFixed(5)}
            </span>
          ) : (
            <span className="italic text-slate-400">No signal</span>
          )}
        </div>
        <div className="text-right">
          <span className="text-slate-400">Speed: </span>
          <span className="font-medium text-slate-800">
            {device.location ? `${device.location.speed.toFixed(1)} km/h` : '-'}
          </span>
        </div>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-xs"
      >
        <label
          htmlFor={`interval-${device.espId}`}
          className="text-slate-500"
        >
          Telemetry Interval
        </label>

        <select
          id={`interval-${device.espId}`}
          disabled={isSubmitting}
          value={device.interval}
          onChange={(e) => 
            onChangeInterval(device, Number(e.target.value) as IntervalOptions
          )}
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-800 focus:border-slate-900 focus:outline-none disabled:opacity-50"
        >
          {!INTERVAL_OPTIONS.includes(device.interval) && (
            <option value={device.interval}>{device.interval}s</option>
          )}
          {INTERVAL_OPTIONS.map((sec) => (
            <option key={sec} value={sec}>
              {sec}s
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
