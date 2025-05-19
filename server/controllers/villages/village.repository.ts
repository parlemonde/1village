import { Village } from '../../entities/village';
import { AppDataSource } from '../../utils/data-source';

const villageRepository = AppDataSource.getRepository(Village);

type GetVillagesParams = {
  countryCode?: string;
  villageId?: number;
};

export const getVillages = async ({ countryCode, villageId }: GetVillagesParams) => {
  const villageQB = villageRepository.createQueryBuilder('village');

  if (countryCode) {
    villageQB.where('village.countryCodes LIKE :likeCountryCode', {
      likeCountryCode: `%${countryCode}%`,
    });
  }

  if (villageId) {
    villageQB.where('village.id = :villageId', { villageId });
  }

  return await villageQB.getMany();
};
