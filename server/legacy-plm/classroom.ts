import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';
import { countries } from '../utils/iso-3166-countries-french';

export type PlmClassroom = {
  plm_id: string;
  country: string;
  email: string;
};

const villageRepository = AppDataSource.getRepository(Village);
const generalInformationLabel = 'Informations générales';
const excludedDomains = ['@parlemonde.org', '@parlemonde.slack.com', '@yopmail'];
const frenchDomTom = [
  { isoCode: 'FR', name: 'Réunion' },
  { isoCode: 'FR', name: 'Guadeloupe' },
  { isoCode: 'FR', name: 'Martinique' },
  { isoCode: 'FR', name: 'Guyane Française' },
];

async function createVillage(plmClassroom: PlmClassroom): Promise<boolean> {
  const plmId = parseInt(plmClassroom.plm_id || '0');

  const isInternalOrTemporaryEmail = excludedDomains.some((domain) => plmClassroom?.email?.includes(domain));

  if (isInternalOrTemporaryEmail) {
    return false;
  }

  const village = await villageRepository.findOne({
    where: { plmId },
  });

  const country = [...countries, ...frenchDomTom].find((country) => country.name === plmClassroom.country);

  if (!village || !country || village?.name === generalInformationLabel) {
    return false;
  }

  const { isoCode } = country;

  const currentCount = village.classroomsStats?.registeredClassrooms?.[isoCode] || 0;

  village.classroomsStats = {
    registeredClassrooms: {
      ...(village.classroomsStats?.registeredClassrooms || {}),
      [isoCode]: currentCount + 1,
    },
  };

  await villageRepository.save(village);

  return true;
}

export async function createClassroom(plmClassrooms: PlmClassroom[]): Promise<number> {
  let successCount = 0;
  for (const classroom of plmClassrooms) {
    const success = await createVillage(classroom);

    if (success) {
      successCount++;
    }
  }

  return successCount;
}
