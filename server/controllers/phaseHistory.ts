import { PhaseHistory } from '../entities/phaseHistory';
import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

export const phaseHistoryController = new Controller('/phase-history');

phaseHistoryController.post({ path: '/' }, async (_req, res) => {
  const data = _req.body;
  try {
    //Find village wit ha given id
    const villageRepository = AppDataSource.getRepository(Village);
    const village = await villageRepository.findOne({ where: { id: data.villageId } });
    if (!village) throw new Error('Village Not found');

    // Create a PhaseHistory instance and fill it with data
    const phaseHistory = new PhaseHistory();
    phaseHistory.village = village;
    phaseHistory.phase = data.phase;

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
  console.log('SOFT DELETE');
  console.log(villageId, phase);
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
