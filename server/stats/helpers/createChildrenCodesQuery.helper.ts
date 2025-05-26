import { Student } from '../../entities/student';
import { AppDataSource } from '../../utils/data-source';

const studentRepository = AppDataSource.getRepository(Student);
export const createChildrenCodesQuery = () => {
  return studentRepository.createQueryBuilder('student').innerJoin('student.classroom', 'classroom').innerJoin('classroom.village', 'village');
};

export const createChildreCodesInCountryQuery = (countryId: string) => {
  return createChildrenCodesQuery().andWhere('classroom.countryCode = :countryId', { countryId });
};
