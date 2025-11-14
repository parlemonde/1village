import type { VillagePhase } from '../../../types/village.type';
import { Student } from '../../entities/student';
import { AppDataSource } from '../../utils/data-source';

const studentRepository = AppDataSource.getRepository(Student);

export const createChildrenCodesQuery = (phase?: VillagePhase) => {
  const queryBuilder = studentRepository
    .createQueryBuilder('student')
    .innerJoin('student.classroom', 'classroom')
    .innerJoin('classroom.village', 'village');

  if (phase) {
    queryBuilder.andWhere('village.activePhase = :phase', { phase });
  }

  return queryBuilder;
};

export const createChildrenCodesInCountryQuery = (countryId: string, phase: number | undefined) => {
  return createChildrenCodesQuery(phase).andWhere('classroom.countryCode = :countryId', { countryId });
};
