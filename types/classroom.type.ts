import type { User } from 'server/entities/user';

import type { Country } from './country.type';

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
