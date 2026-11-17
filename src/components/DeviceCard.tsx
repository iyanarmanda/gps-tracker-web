import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { INTERVAL_OPTIONS } from '@/constants/interval.constant';

import type { Device } from '@/services/interfaces/device.interface';
import type { IntervalOptions } from '@/constants/interval.constant';

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
    <Card
      onClick={() => onSelect(device.espId)}
      className={`cursor-pointer gap-0 py-0 shadow-none transition-colors ${
        isSelected
          ? 'border-primary bg-accent/40 ring-1 ring-primary'
          : 'hover:border-foreground/30'
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  device.isActive ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                }`}
              />
              <h3 className="truncate text-sm font-semibold leading-none">
                {device.name}
              </h3>
            </div>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {device.espId}
            </p>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex shrink-0 items-center gap-2"
          >
            <span className="text-[11px] font-medium text-muted-foreground">
              {device.isActive ? 'ON' : 'OFF'}
            </span>
            <Switch
              checked={device.isActive}
              disabled={isSubmitting}
              onCheckedChange={() => onToggleActive(device)}
              aria-label={`Toggle ${device.name}`}
            />
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-[11px]">
          <div>
            <span className="text-muted-foreground">Coord: </span>
            {device.location ? (
              <span className="font-mono font-medium">
                {device.location.lat.toFixed(5)},{' '}
                {device.location.lng.toFixed(5)}
              </span>
            ) : (
              <span className="italic text-muted-foreground">No signal</span>
            )}
          </div>
          <div className="text-right">
            <span className="text-muted-foreground">Speed: </span>
            <span className="font-medium">
              {device.location
                ? `${device.location.speed.toFixed(1)} km/h`
                : '-'}
            </span>
          </div>
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-2.5 flex items-center justify-between border-t pt-2 text-xs"
        >
          <span className="text-muted-foreground">Telemetry Interval</span>

          <Select
            disabled={isSubmitting}
            value={String(device.interval)}
            onValueChange={(val) =>
              onChangeInterval(device, Number(val) as IntervalOptions)
            }
          >
            <SelectTrigger
              size="sm"
              className="w-20 text-xs font-medium"
              aria-label={`Interval for ${device.name}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {!(INTERVAL_OPTIONS as readonly number[]).includes(
                device.interval,
              ) && (
                <SelectItem value={String(device.interval)}>
                  {device.interval}s
                </SelectItem>
              )}
              {INTERVAL_OPTIONS.map((sec) => (
                <SelectItem key={sec} value={String(sec)}>
                  {sec}s
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
