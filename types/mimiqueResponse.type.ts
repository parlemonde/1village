import { User } from './user.type';

export enum MimiqueResponseValue {
  SIGNIFICATION = 0,
  FAKE_SIGNIFICATION_1 = 1,
  FAKE_SIGNIFICATION_2 = 2,
}

export interface MimiqueResponse {
  id: number;
  createDate?: Date | string;
  updateDate?: Date | string;
  deleteDate?: Date | string;
  userId: number;
  villageId: number;
  mimiqueId: number;
  value: MimiqueResponseValue;
  user: User | null;
}
