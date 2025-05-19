import { Village } from '../../entities/village';
import { AppDataSource } from '../../utils/data-source';

const villageRepository = AppDataSource.getRepository(Village);

export const getVillages = async () => {
  const villages = await villageRepository.find();

  return villages;
};
