export type ActivityDataType = 'text' | 'video' | 'image' | 'json' | 'h5p' | 'sound';

export interface ActivityData {
  id: number;
  activityId: number;
  order: number;
  key: ActivityDataType;
  value: string;
}
