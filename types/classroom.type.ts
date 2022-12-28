export interface Classroom {
    id: number;
    userId: number;
    villageId: number;
    name?: string;
    avatar?: string;
    delayedDays?: number;
    hasVisibilitySetToClass?: boolean;
  }