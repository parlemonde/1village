import { Classroom } from '../../entities/classroom';
import { AppDataSource } from '../../utils/data-source';

const classroomRepository = AppDataSource.getRepository(Classroom);

export const selectCountriesWithVillages = async (): Promise<{ countryCode: string }[]> => {
  return await classroomRepository.createQueryBuilder('classroom').distinct().select(['classroom.countryCode AS countryCode']).getRawMany();
};
