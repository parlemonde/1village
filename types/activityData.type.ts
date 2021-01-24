export interface ActivityData {
  id: number;
  activityId: number;
  order: number;
  key: "text" | "video" | "image" | "json";
  value: string;
}
