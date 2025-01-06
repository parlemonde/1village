import { getPhasePeriod, phaseWasSelected } from '.';
import { User } from '../../entities/user';
import { Village } from '../../entities/village';
import { AppDataSource } from '../../utils/data-source';

const userRepository = AppDataSource.getRepository(User);
const villageRepository = AppDataSource.getRepository(Village);

export const createFamilyAccountQuery = async (villageId: number, phase: number | undefined) => {
  const query = userRepository
    .createQueryBuilder('user')
    .innerJoin('user.village', 'village')
    .innerJoin('classroom', 'classroom', 'classroom.villageId = village.id')
    .innerJoin('student', 'student', 'student.classroomId = classroom.id')
    .where('user.type = 3')
    .andWhere('classroom.villageId = :villageId', { villageId });
  if (phaseWasSelected(phase)) {
    const { debut, end } = await getPhasePeriod(villageId, phase as number);
    query.andWhere('user.createdAt >= :debut', { debut });

    const village = await villageRepository.findOne({ where: { id: villageId } });
    if (phase !== village?.activePhase) query.andWhere('student.createdAt <= :end', { end });
  }

  query.groupBy('user.id');
  return query;
};
