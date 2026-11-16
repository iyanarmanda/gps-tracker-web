import type { DeviceLocation } from './device-location';

export interface Device {
  id: number;
  espId: string;
  name: string;
  isActive: boolean;
  interval: number;
  activatedAt: string | null;
  createdAt: string;
  location: DeviceLocation | null;
}

