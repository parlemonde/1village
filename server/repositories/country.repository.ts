import { Classroom } from '../entities/classroom';
import { AppDataSource } from '../utils/data-source';

const classroomRepository = AppDataSource.getRepository(Classroom);

export async function getCountryCodes(): Promise<{ countryCode: string }[]> {
  return await classroomRepository.createQueryBuilder('classroom').select('classroom.countryCode', 'countryCode').distinct(true).getRawMany();
}
