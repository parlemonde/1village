import type { WhereClause } from '../../../types/statistics.type';
import type { Village } from '../../entities/village';
import { addPhaseFilteringToQuery } from './addPhaseFilteringToQuery.helper';
import { createChildrenCodesQuery } from './createChildrenCodesQuery.helper';
import { createConnectedFamilyQuery } from './createConnectedFamilyQuery.helper';
import { createFamilyAccountQuery } from './createFamilyAccountQuery.helper';

export const countFamilyAccounts = async (village: Village, phase: number | undefined): Promise<number> => {
  const query = createFamilyAccountQuery(village.id);
  if (village && phase) await addPhaseFilteringToQuery(query, phase, village);
  return query.getCount();
};

export const countChildrenCodes = async (village: Village, phase: number | undefined, whereClause?: WhereClause): Promise<number> => {
  const query = createChildrenCodesQuery();
  if (whereClause) query.where(whereClause.clause, whereClause.value);
  if (village && phase) await addPhaseFilteringToQuery(query, phase, village);
  return query.getCount();
};

export const countConnectedFamilies = async (village: Village, phase: number | undefined, classroomId?: number): Promise<number> => {
  const query = createConnectedFamilyQuery();
  if (classroomId) query.andWhere('classroom.id = :classroomId', { classroomId });
  if (village) query.andWhere('village.id = :villageId', { villageId: village.id });
  if (village && phase) await addPhaseFilteringToQuery(query, phase, village);
  return query.getCount();
};
