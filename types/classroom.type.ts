import type { Country } from './country.type';
import type { User } from './user.type';

export interface Classroom {
  id: number;
  userId: number;
  villageId: number;
  name?: string;
  avatar?: string;
  country?: Country;
  delayedDays?: number;
  hasVisibilitySetToClass?: boolean;
  user?: User;
  defaultPrintMessage?: string;
}

export interface ClassroomAsFamilly {
  student: {
    classroom: {
      user: string;
    };
    firstname: string;
    id: number;
    lastname: string;
  };
}

export type StateOptions = {
  delayedDays: number;
  hasVisibilitySetToClass: boolean;
};

export interface InitialStateOptionsProps {
  default: StateOptions;
  timeDelay: StateOptions;
  ownClass: StateOptions;
  ownClassTimeDelay: StateOptions;
}

export interface ClassroomFilter {
  villageId: string;
}
