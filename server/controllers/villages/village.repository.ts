import { Village } from '../../entities/village';
import { AppDataSource } from '../../utils/data-source';

const villageRepository = AppDataSource.getRepository(Village);

type GetVillagesParams = {
  villageIds?: number[];
};

export const getVillages = async ({ villageIds = [] }: GetVillagesParams) => {
  const villageQB = villageRepository.createQueryBuilder('village');

  if (villageIds?.length > 0) {
    villageQB.where('village.id IN (:...villageIds)', { villageIds });
  }

  return await villageQB.getMany();
};
