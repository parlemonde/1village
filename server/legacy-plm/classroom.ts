import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';
import { countries } from '../utils/iso-3166-countries-french';

export type PlmClassroom = {
  plm_id: number;
  country: string;
  email: string;
};

const villageRepository = AppDataSource.getRepository(Village);

async function createVillage(plmClassroom: PlmClassroom): Promise<boolean> {
  const plmId = plmClassroom.plm_id || 0;

  const village = await villageRepository.findOne({
    where: { plmId },
  });

  const country = countries.find((country) => country.name === plmClassroom.country);

  if (!village || !country) {
    return false;
  }

  if (!village.classroomsStats) {
    village.classroomsStats = { registeredClassrooms: {} };
  }

  const countryCode = country.isoCode;
  village.classroomsStats.registeredClassrooms[countryCode] = (village.classroomsStats.registeredClassrooms[countryCode] || 0) + 1;

  await villageRepository.save(village);

  return true;
}

export async function createClassroom(plmClassrooms: PlmClassroom[]): Promise<number> {
  return (await Promise.all(plmClassrooms.map(createVillage))).filter((r) => r).length;
}
