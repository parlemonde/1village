export interface StudentForm {
  firstname?: string;
  lastname?: string;
  hashedCode?: string;
}
export interface Student extends StudentForm {
  id: number;
  classroomId: number;
  numLinkedAccount?: number;
}
// & { data: T}
// Show only the data visible for the student form
