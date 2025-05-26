import { Student } from '../../entities/student';
import { AppDataSource } from '../../utils/data-source';

const studentRepository = AppDataSource.getRepository(Student);
export const createConnectedFamilyQuery = () => {
  return studentRepository
    .createQueryBuilder('student')
    .innerJoin('classroom', 'classroom', 'classroom.id = student.classroomId')
    .innerJoin('classroom.village', 'village')
    .andWhere('student.numLinkedAccount >= 1');
};

export const createConnectedFamilyInCountryQuery = (countryId: string) => {
  return createConnectedFamilyQuery().andWhere('classroom.countryCode = :countryId', { countryId });
};
