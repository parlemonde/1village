import type { Country } from './country.type';
import type { Village } from './village.type';

export enum UserType {
  SUPER_ADMIN = 0,
  ADMIN = 1,
  TEACHER = 2,
  MEDIATOR = 3,
  OBSERVATOR = 4,
  FAMILY = 5,
}

export const userTypeNames = {
  [UserType.SUPER_ADMIN]: 'Super admin',
  [UserType.ADMIN]: 'Admin',
  [UserType.TEACHER]: 'Professeur',
  [UserType.MEDIATOR]: 'Médiateur',
  [UserType.OBSERVATOR]: 'Observateur',
  [UserType.FAMILY]: 'Parent',
};

export interface User {
  id: number;
  email: string;
  pseudo: string;
  firstname: string;
  lastname: string;
  school: string;
  level: string;
  city: string;
  postalCode: string;
  address: string;
  position: {
    lat: number;
    lng: number;
  };

  avatar: string | null;
  displayName: string | null;

  firstLogin: number;

  type: UserType;
  accountRegistration: number;

  // village relation
  villageId: number | null;
  village: Village | null;

  // country relation
  country: Country;

  mascotteId?: number;
}

export type UserForm = {
  firstname: string;
  lastname: string;
  pseudo: string;
  email: string;
  password: string;
  passwordConfirmation?: string;
  type: UserType.FAMILY;
};
