import { Village } from '../../entities/village';
import { AppDataSource } from '../../utils/data-source';

export interface VillageWithNameAndId {
  id: number;
  name: string;
}

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

export async function getAllVillagesNames(): Promise<VillageWithNameAndId[]> {
  return villageRepository.find({ select: { id: true, name: true } });
}

export async function getVillageById(id: number): Promise<Village | null> {
  return await villageRepository.findOneBy({ id });
}
