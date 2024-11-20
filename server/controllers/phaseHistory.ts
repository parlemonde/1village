import { PhaseHistory } from '../entities/phaseHistory';
import { Village, VillagePhase } from '../entities/village';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const handlePhase1toPhase3Case = async (village: Village, phase: number) => {
  if (village.activePhase === VillagePhase.DISCOVER && phase === VillagePhase.IMAGINE) {
    const phaseHistory = new PhaseHistory();
    phaseHistory.village = village;
    phaseHistory.phase = VillagePhase.EXCHANGE;
    phaseHistory.endingOn = new Date();

    const phaseHistoryRepository = AppDataSource.getRepository(PhaseHistory);

    await phaseHistoryRepository.save(phaseHistory);

    const endPhase1Query = phaseHistoryRepository
      .createQueryBuilder()
      .softDelete()
      .where('villageId = :villageId', { villageId: village.id })
      .andWhere('phase = :phase', { phase: VillagePhase.DISCOVER });
    await endPhase1Query.execute();
  }
};
export const phaseHistoryController = new Controller('/phase-history');

phaseHistoryController.post({ path: '/' }, async (_req, res) => {
  const data = _req.body;
  try {
    //Find village wit a given id
    const villageRepository = AppDataSource.getRepository(Village);
    const village = await villageRepository.findOne({ where: { id: data.villageId } });
    if (!village) throw new Error('Village Not found');

    await handlePhase1toPhase3Case(village, data.phase);

    // Create a PhaseHistory instance and fill it with data
    const phaseHistory = new PhaseHistory();
    phaseHistory.village = village;
    phaseHistory.phase = data.phase;
    phaseHistory.startingOn = new Date();

    // Save phase history in db
    const phaseHistoryRepository = AppDataSource.getRepository(PhaseHistory);
    await phaseHistoryRepository.save(phaseHistory);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
  }
});

phaseHistoryController.delete({ path: '/soft-delete/:villageId/:phase' }, async (_req, res) => {
  const { villageId, phase } = _req.params;
  const phaseHistoryRepository = AppDataSource.getRepository(PhaseHistory);
  const query = phaseHistoryRepository
    .createQueryBuilder()
    .softDelete()
    .where('villageId = :villageId', { villageId })
    .andWhere('phase = :phase', { phase });

  try {
    await query.execute();
    res.sendStatus(202);
  } catch (e) {
    console.error(e);
  }
});
