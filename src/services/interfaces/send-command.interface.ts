import type { IntervalOptions } from '@/constants/interval.constant';
import type { Device } from './device.interface';

export interface SendCommandPayload {
  active: boolean;
  interval?: IntervalOptions;
}

export interface SendCommandResponse {
  device: Omit<Device, 'location'>;
  published: {
    topic: string;
    payload: {
      device_id: string;
      active: boolean;
      interval_seconds: number;
      timestamp: number;
    };
  };
}

