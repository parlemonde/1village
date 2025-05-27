import { Village } from '../../entities/village';
import { AppDataSource } from '../../utils/data-source';

const villageRepository = AppDataSource.getRepository(Village);

export const selectCountriesOfVillages = async (): Promise<{ countryCodes: string }[]> => {
  return await villageRepository.createQueryBuilder('village').select(['village.countryCodes AS countryCodes']).getRawMany();
};
