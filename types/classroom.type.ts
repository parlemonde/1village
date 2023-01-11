export interface Classroom {
  id: number;
  userId: number;
  villageId: number;
  name?: string;
  avatar?: string;
  delayedDays?: number;
  hasVisibilitySetToClass?: boolean;
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
