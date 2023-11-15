export interface Comment {
  isoCode: string;
  id: number;
  activityId: number;
  userId: number;
  createDate?: Date | string;
  updateDate?: Date | string;
  text: string;
}
