import type { VillagePhase } from '../entities/village';
import {
  generateEmptyFilterParams,
  getChildrenCodesCount,
  getConnectedFamiliesCount,
  getFamiliesWithoutAccount,
  getFamilyAccountsCount,
  getFloatingAccounts,
} from './queryStatsByFilter';

export const getChildrenCodesCountForCountry = async (countryId: string, phase: VillagePhase) => {
  let filterParams = generateEmptyFilterParams();
  filterParams = { ...filterParams, countryId, phase };
  const whereClause = { clause: 'classroom.countryCode = :countryId', value: { countryId } };
  return await getChildrenCodesCount(filterParams, whereClause);
};

export const getFamilyAccountsCountForCountry = async (countryId: string, phase: number) => {
  let filterParams = generateEmptyFilterParams();
  filterParams = { ...filterParams, countryId, phase };
  return await getFamilyAccountsCount(filterParams);
};

export const getConnectedFamiliesCountForCountry = async (countryId: string, phase: number) => {
  let filterParams = generateEmptyFilterParams();
  filterParams = { ...filterParams, countryId, phase };
  return await getConnectedFamiliesCount(filterParams);
};

export const getFamiliesWithoutAccountForCountry = async (countryId: string) => {
  return getFamiliesWithoutAccount('classroom.countryCode = :countryId', { countryId });
};

export const getFloatingAccountsForCountry = async (countryId: string) => {
  let filterParams = generateEmptyFilterParams();
  filterParams = { ...filterParams, countryId };
  return await getFloatingAccounts(filterParams);
};
