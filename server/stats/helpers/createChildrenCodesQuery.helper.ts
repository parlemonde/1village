import { Student } from '../../entities/student';
import { AppDataSource } from '../../utils/data-source';

const studentRepository = AppDataSource.getRepository(Student);
export const createChildrenCodesQuery = () => {
  const query = studentRepository.createQueryBuilder('student').innerJoin('student.classroom', 'classroom').innerJoin('classroom.village', 'village');
  return query;
};
