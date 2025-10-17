import type { VillagePhase } from '../../../types/village.type';
import { Student } from '../../entities/student';
import { AppDataSource } from '../../utils/data-source';

const studentRepository = AppDataSource.getRepository(Student);

export const createConnectedFamilyQuery = (phase?: VillagePhase) => {
  const queryBuilder = studentRepository
    .createQueryBuilder('student')
    .innerJoin('student.classroom', 'classroom')
    .innerJoin('classroom.village', 'village')
    .andWhere('student.numLinkedAccount >= 1');

  if (phase) {
    queryBuilder.andWhere('village.activePhase = :phase', { phase });
  }

  return queryBuilder;
};

export const createConnectedFamilyInCountryQuery = (countryId: string) => {
  return createConnectedFamilyQuery().andWhere('classroom.countryCode = :countryId', { countryId });
};
