import { generateEmptyFilterParams } from './helpers';
import {
  getChildrenCodesCount,
  getConnectedFamiliesCount,
  getFamiliesWithoutAccount,
  getFamilyAccountsCount,
  getFloatingAccounts,
} from './queryStatsByFilters';

export const getFamiliesWithoutAccountForGlobal = async () => {
  return getFamiliesWithoutAccount();
};

export const getConnectedFamiliesCountForGlobal = async () => {
  const filterParams = generateEmptyFilterParams();
  return getConnectedFamiliesCount(filterParams);
};

export const getChildrenCodesCountForGlobal = async () => {
  const filterParams = generateEmptyFilterParams();
  return await getChildrenCodesCount(filterParams);
};
export const getFloatingAccountsForGlobal = async () => {
  const filterParams = generateEmptyFilterParams();
  return await getFloatingAccounts(filterParams);
};

export const getFamilyAccountsCountForGlobal = async () => {
  const filterParams = generateEmptyFilterParams();
  return await getFamilyAccountsCount(filterParams);
};
