import type { User } from './user.type';

// Show only the data visible for the student form
export interface StudentForm {
  firstname?: string;
  lastname?: string;
}

export interface Student extends StudentForm {
  id: number;
  classroomId: number;
  numLinkedAccount?: number;
  hashedCode?: string;
  users?: User[];
}
