import { API_BASE_URL } from '../constants/api.constant';

import type { Device } from './interfaces/device.interface';
import type { SendCommandPayload, SendCommandResponse } from './interfaces/send-command.interface';

export async function fetchDevices(): Promise<Device[]> {
  const response = await fetch(`${API_BASE_URL}/v1/devices`);

  if (!response.ok) {
    throw new Error(`Failed to fetch devices (HTTP ${String(response.status)})`);
  }

  return (await response.json()) as Device[];
}

export async function sendDeviceCommand(
  espId: string,
  payload: SendCommandPayload,
): Promise<SendCommandResponse> {
  const response = await fetch(
    `${API_BASE_URL}/v1/devices/${encodeURIComponent(espId)}/command`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(
      errorBody?.message ?? `Command failed (HTTP ${String(response.status)})`,
    );
  }

  return (await response.json()) as SendCommandResponse;
}
