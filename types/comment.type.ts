export interface Comment {
  id: number;
  activityId: number;
  userId: number;
  createDate?: Date | string;
  updateDate?: Date | string;
  text: string;
}
