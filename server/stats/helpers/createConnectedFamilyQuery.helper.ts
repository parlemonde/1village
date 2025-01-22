import { Student } from '../../entities/student';
import { AppDataSource } from '../../utils/data-source';

const studentRepository = AppDataSource.getRepository(Student);
export const createConnectedFamilyQuery = () => {
  const query = studentRepository
    .createQueryBuilder('student')
    .innerJoin('classroom', 'classroom', 'classroom.id = student.classroomId')
    .innerJoin('classroom.village', 'village')
    .andWhere('student.numLinkedAccount >= 1');
  return query;
};
