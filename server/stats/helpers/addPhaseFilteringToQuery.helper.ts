import type { Classroom } from '../../entities/classroom';
import type { Student } from '../../entities/student';
import type { User } from '../../entities/user';
import type { Village, VillagePhase } from '../../entities/village';
import type { SelectQueryBuilder } from 'typeorm';

import { getPhasePeriod, phaseWasSelected } from '.';

export const addPhaseFilteringToQuery = async <T extends User | Student | Classroom>(
  query: SelectQueryBuilder<T>,
  phase: VillagePhase,
  village: Village,
) => {
  if (phaseWasSelected(phase)) {
    const phaseValue = phase as number;
    const { debut, end } = await getPhasePeriod(village.id, phaseValue);
    query.andWhere('student.createdAt >= :debut', { debut });
    if (phaseValue != village?.activePhase) query.andWhere('student.createdAt <= :end', { end });
  }
  return query;
};
