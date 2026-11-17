import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Badge } from '@/components/ui/badge';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/constants/map.constant';

import type { Device } from '@/services/interfaces/device.interface';

interface TrackerMapProps {
  devices: Device[];
  selectedEspId: string | null;
  onSelectDevice: (espId: string) => void;
}

function createDeviceIcon(isActive: boolean, isSelected: boolean): L.DivIcon {
  const ringClass = isSelected
    ? 'ring-4 ring-primary/25 scale-110'
    : 'ring-2 ring-background';
  const dotClass = isActive ? 'bg-emerald-500' : 'bg-muted-foreground/50';

  return L.divIcon({
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
    html: `<div class="flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-md transition-transform ${ringClass}">
      <span class="h-3.5 w-3.5 rounded-full ${dotClass}"></span>
    </div>`,
  });
}

const MapFocusController = ({
  selectedDevice,
}: {
  selectedDevice: Device | undefined;
}) => {
  const map = useMap();
  const lat = selectedDevice?.location?.lat;
  const lng = selectedDevice?.location?.lng;

  useEffect(() => {
    if (lat === undefined || lng === undefined) return;
    map.flyTo([lat, lng], Math.max(map.getZoom(), 15), {
      duration: 0.7,
    });
  }, [map, lat, lng]);

  return null;
};

export const TrackerMap = ({
  devices,
  selectedEspId,
  onSelectDevice,
}: TrackerMapProps) => {
  const devicesWithLocation = useMemo(
    () => devices.filter((d) => d.location !== null),
    [devices],
  );

  const selectedDevice = useMemo(
    () => devices.find((d) => d.espId === selectedEspId),
    [devices, selectedEspId],
  );

  const firstWithLoc =
    selectedDevice?.location ?? devicesWithLocation[0]?.location;
  const initialCenter: [number, number] = firstWithLoc
    ? [firstWithLoc.lat, firstWithLoc.lng]
    : DEFAULT_CENTER;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={initialCenter}
        zoom={DEFAULT_ZOOM}
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFocusController selectedDevice={selectedDevice} />

        {devicesWithLocation.map((device) => {
          const loc = device.location!;
          const isSelected = device.espId === selectedEspId;

          return (
            <Marker
              key={device.espId}
              position={[loc.lat, loc.lng]}
              icon={createDeviceIcon(device.isActive, isSelected)}
              eventHandlers={{
                click: () => onSelectDevice(device.espId),
              }}
            >
              <Popup>
                <div className="min-w-44 space-y-1.5 font-sans text-xs text-foreground">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{device.name}</span>
                    <Badge
                      variant={device.isActive ? 'outline' : 'secondary'}
                      className={
                        device.isActive
                          ? 'border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400'
                          : 'px-1.5 py-0 text-[10px] font-semibold'
                      }
                    >
                      {device.isActive ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {device.espId}
                  </p>
                  <div className="space-y-0.5 border-t pt-1.5 text-[11px]">
                    <p>
                      <span className="text-muted-foreground">Coord: </span>
                      <span className="font-mono">
                        {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Speed: </span>
                      <span>{loc.speed.toFixed(1)} km/h</span>
                      <span className="text-muted-foreground"> &bull; Sat: </span>
                      <span>{loc.satellites}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Updated:{' '}
                      {new Date(loc.updatedAt * 1000).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {devicesWithLocation.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-[400] flex justify-center px-4">
          <Badge
            variant="outline"
            className="bg-background/95 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur-xs"
          >
            Coordinate GPS is empty.
          </Badge>
        </div>
      )}
    </div>
  );
};
