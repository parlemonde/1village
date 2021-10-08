import type { User } from './user.type';

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
