import type { VillagePhase } from '../entities/village';
import { generateEmptyFilterParams } from './helpers';
import {
  getChildrenCodesCount,
  getConnectedFamiliesCount,
  getFamiliesWithoutAccount,
  getFamilyAccountsCount,
  getFloatingAccounts,
} from './queryStatsByFilters';

export const getChildrenCodesCountForVillage = async (villageId: number, phase: VillagePhase) => {
  let filterParams = generateEmptyFilterParams();
  filterParams = { ...filterParams, villageId, phase };
  const whereClause = { clause: 'classroom.villageId = :villageId', value: { villageId } };

  return await getChildrenCodesCount(filterParams, whereClause);
};

export const getFamilyAccountsCountForVillage = async (villageId: number, phase: number) => {
  let filterParams = generateEmptyFilterParams();
  filterParams = { ...filterParams, villageId, phase };

  return await getFamilyAccountsCount(filterParams);
};

export const getConnectedFamiliesCountForVillage = async (villageId: number, phase: number) => {
  let filterParams = generateEmptyFilterParams();
  filterParams = { ...filterParams, villageId, phase };

  return await getConnectedFamiliesCount(filterParams);
};

export const getFamiliesWithoutAccountForVillage = async (villageId: number) => {
  return getFamiliesWithoutAccount('classroom.villageId = :villageId', { villageId });
};

export const getFloatingAccountsForVillage = async (villageId: number) => {
  let filterParams = generateEmptyFilterParams();
  filterParams = { ...filterParams, villageId };

  return await getFloatingAccounts(filterParams);
};
