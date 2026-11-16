export const INTERVAL_OPTIONS = [2, 5, 10, 30] as const;

export type IntervalOptions = (typeof INTERVAL_OPTIONS)[number];
