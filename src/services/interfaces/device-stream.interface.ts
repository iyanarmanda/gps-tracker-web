export interface DeviceTelemetryStreamEvent {
  espId: string;
  lat: number;
  lng: number;
  speed: number;
  satellites: number;
  active: boolean;
  updatedAt: number;
}

export interface DeviceStatusStreamEvent {
  espId: string;
  active: boolean;
  interval: number;
  updatedAt: number;
}

