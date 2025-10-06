import { Classroom } from '../entities/classroom';
import { User } from '../entities/user';
import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';
import { countries } from '../utils/iso-3166-countries-french';
import { logger } from '../utils/logger';

export type PlmClassroom = {
  user_id: number;
  plm_id: number;
  country: string;
  email: string;
};

const classroomRepository = AppDataSource.getRepository(Classroom);
const userRepository = AppDataSource.getRepository(User);
const villageRepository = AppDataSource.getRepository(Village);

async function createVillage(plmClassroom: PlmClassroom): Promise<boolean> {
  const plmId = plmClassroom.plm_id || 0;
  const userId = plmClassroom.user_id;
  const email = plmClassroom.email;

  // Check if a classroom already exists
  const classroomCount = await classroomRepository.count({
    where: { user: { id: userId, email: email } },
  });

  if (classroomCount > 0) {
    return false;
  }

  // Create a new classroom
  const matchingCountry = countries.find((c) => c.name === plmClassroom.country);
  const existingUser = await userRepository.findOne({
    where: { id: userId },
  });
  const userVillage = await villageRepository.findOne({
    where: { users: { id: userId } },
    relations: { users: true },
  });

  const classroom = new Classroom();

  if (matchingCountry?.isoCode) {
    classroom.countryCode = matchingCountry.isoCode;
  }

  if (existingUser) {
    classroom.user = existingUser;
  }

  if (userVillage) {
    classroom.village = userVillage;
    classroom.villageId = userVillage.id;
  }

  await classroomRepository.save(classroom);
  logger.info(`Classroom created for user ${userId} with village ${userVillage?.id}`);

  return true;
}

export async function createClassroom(plmClassrooms: PlmClassroom[]): Promise<number> {
  const promises = plmClassrooms.map((v) => createVillage(v));
  const results = await Promise.all(promises);
  return results.filter((r) => r).length;
}
