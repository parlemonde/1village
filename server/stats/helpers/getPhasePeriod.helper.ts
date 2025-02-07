import { PhaseHistory } from '../../entities/phaseHistory';
import { AppDataSource } from '../../utils/data-source';

const phaseHistoryRepository = AppDataSource.getRepository(PhaseHistory);
export const getPhasePeriod = async (villageId: number, phase: number): Promise<{ debut: Date | undefined; end: Date | undefined }> => {
  // Getting the debut and end dates for the given phase
  const query = phaseHistoryRepository
    .createQueryBuilder('phaseHistory')
    .withDeleted()
    .where('phaseHistory.villageId = :villageId', { villageId })
    .andWhere('phaseHistory.phase = :phase', { phase });
  query.select(['phaseHistory.startingOn', 'phaseHistory.endingOn']);
  const result = await query.getOne();
  const debut = result?.startingOn;
  const end = result?.endingOn;
  return {
    debut,
    end,
  };
};
