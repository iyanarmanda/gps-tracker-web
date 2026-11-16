import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../../constants/map.constant';
import type { Device } from '../../services/interfaces/device.interface';

interface TrackerMapProps {
  devices: Device[];
  selectedEspId: string | null;
  onSelectDevice: (espId: string) => void;
}

function createDeviceIcon(isActive: boolean, isSelected: boolean): L.DivIcon {
  const ringClass = isSelected
    ? 'ring-4 ring-slate-900/25 scale-110'
    : 'ring-2 ring-white';
  const dotClass = isActive ? 'bg-emerald-500' : 'bg-slate-400';

  return L.divIcon({
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
    html: `<div class="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-transform ${ringClass}">
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
                <div className="min-w-44 space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900">
                      {device.name}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        device.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {device.isActive ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-500">
                    {device.espId}
                  </p>
                  <div className="border-t border-slate-100 pt-1 text-[11px] text-slate-700">
                    <p>
                      Coord: {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
                    </p>
                    <p>
                      Speed: {loc.speed.toFixed(1)} km/h &bull; Sat:{' '}
                      {loc.satellites}
                    </p>
                    <p className="text-slate-400">
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
          <p className="rounded-full border border-slate-200 bg-white/95 px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-xs">
            Coordinate GPS is empty.
          </p>
        </div>
      )}
    </div>
  );
};
