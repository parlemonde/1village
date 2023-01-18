import type { Country } from './country.type';
import type { Village } from './village.type';

export enum UserType {
  SUPER_ADMIN = 0,
  ADMIN = 1,
  MEDIATOR = 2,
  TEACHER = 3,
  FAMILY = 4,
  OBSERVATOR = 5,
}

export const userTypeNames = {
  [UserType.SUPER_ADMIN]: 'Super admin',
  [UserType.ADMIN]: 'Admin',
  [UserType.MEDIATOR]: 'Médiateur',
  [UserType.TEACHER]: 'Professeur',
  [UserType.FAMILY]: 'Parent',
  [UserType.OBSERVATOR]: 'Observateur',
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
  country: Country | null;

  mascotteId?: number;
}

export type UserForm = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  passwordConfirmation?: string;
  type: UserType.FAMILY;
};
export interface UserParamClassroom {
  classroom_avatar: string | null;
  classroom_delayedDays: number;
  classroom_hasVisibilitySetToClass: number; //! boolean in reality but since I used getRawMany for specific reason, boolean is in fact Tinyint in mysql and it return a number instead
  classroom_id: number;
  classroom_name: string | null;
  classroom_userId: number;
  classroom_villageId: number;
  student_classroomId: number;
  student_firstname: string | null;
  student_hashedCode: string | null;
  student_id: number;
  student_lastname: string | null;
  student_numLinkedAccount: number;
  userStudent_id: number;
  userStudent_studentId: number;
  userStudent_userId: number;
}
