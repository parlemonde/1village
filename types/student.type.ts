export interface Student<T extends {
  id: number;
  classroomId: number;
  firstname?: string;
  lastname?: string;
  hashedCode?: string;
  numLinkedAccount?: number;
}
& { data: T}
// Show only the data visible for the student form
export interface StudentForm {
  firstname?: string;
  lastname?: string;
  hashedCode?: string;
}
