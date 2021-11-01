import type { Activity } from 'types/activity.type';

export type IndiceData = Record<string, never>; // empty object {}

export type IndiceActivity = Activity<IndiceData>;
