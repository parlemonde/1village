import type { User } from './user.type';

/* export enum GameResponseValue {
  SIGNIFICATION = 0,
  FAKE_SIGNIFICATION_1 = 1,
  FAKE_SIGNIFICATION_2 = 2,
} */

export interface GameResponse {
  id: number;
  createDate?: Date | string;
  updateDate?: Date | string;
  deleteDate?: Date | string;
  userId: number;
  villageId: number;
  gameId: number;
  value: string;
  user: User | null;
}
