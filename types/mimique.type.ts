export interface Mimique {
  id: number;
  createDate?: Date | string;
  updateDate?: Date | string;
  deleteDate?: Date | string;
  userId: number;
  villageId: number;
  activityId: number;
  origine: string;
  signification: string;
  fakeSignification1: string;
  fakeSignification2: string;
  video: string;
}
