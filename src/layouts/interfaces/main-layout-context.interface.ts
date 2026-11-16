export type StreamStatus = 'connecting' | 'connected' | 'disconnected';

export interface MainLayoutContext {
  streamStatus: StreamStatus;
  setStreamStatus: (status: StreamStatus) => void;
  deviceStats: {
    active: number;
    total: number;
  };
  setDeviceStats: (stats: { active: number; total: number }) => void;
}

