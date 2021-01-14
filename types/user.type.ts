export enum UserType {
  CLASS = 0,
  ADMIN = 1,
  SUPER_ADMIN = 2,
}

export interface User {
  id: number;
  email: string;
  teacherName: string;
  pseudo: string;
  school: string;
  level: string;
  type: UserType;
}
