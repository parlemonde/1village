import type { Village } from './village.type';

export enum UserType {
  TEACHER = 0,
  OBSERVATOR = 1,
  MEDIATOR = 2,
  ADMIN = 3,
  SUPER_ADMIN = 4,
}

export const userTypeNames = {
  [UserType.TEACHER]: 'Professeur',
  [UserType.OBSERVATOR]: 'Observateur',
  [UserType.MEDIATOR]: 'Médiateur',
  [UserType.ADMIN]: 'Admin',
  [UserType.SUPER_ADMIN]: 'Super admin',
};

export interface User {
  id: number;
  email: string;
  pseudo: string;
  school: string;
  level: string;
  city: string;
  postalCode: string;
  address: string;

  type: UserType;
  accountRegistration: number;

  // village relation
  villageId: number | null;
  village: Village | null;

  // country relation
  countryCode: string;
}
