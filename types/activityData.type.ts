export type ActivityDataType = 'text' | 'video' | 'image' | 'json' | 'h5p';

export interface ActivityData {
  id: number;
  activityId: number;
  order: number;
  key: ActivityDataType;
  value: string;
}
