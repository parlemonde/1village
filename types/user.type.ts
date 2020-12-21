export enum UserType {
  CLASS = 0,
  ADMIN = 1,
  PLMO_ADMIN = 2,
}

export interface User {
  id: number;
  email: string;
  pseudo: string;
  school: string;
  level: string;
  type: UserType;
}
