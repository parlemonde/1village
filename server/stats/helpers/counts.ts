import type { WhereClause } from '../../../types/statistics.type';
import type { Village } from '../../entities/village';
import { addPhaseFilteringToQuery } from './addPhaseFilteringToQuery.helper';
import { createChildreCodesInCountryQuery as createChildrenCodesInCountryQuery, createChildrenCodesQuery } from './createChildrenCodesQuery.helper';
import { createConnectedFamilyQuery, createConnectedFamilyInCountryQuery } from './createConnectedFamilyQuery.helper';
import {
  createFamilyAccountInContryQuery as createFamilyAccountInCountryQuery,
  createFamilyAccountInVillageQuery,
  createFamilyAccountQuery,
} from './createFamilyAccountQuery.helper';

export const countFamilyAccounts = async (village: Village, phase: number | undefined): Promise<number> => {
  const query = createFamilyAccountInVillageQuery(village.id);
  if (village && phase) await addPhaseFilteringToQuery(query, phase, village);
  return query.getCount();
};

export const countFamilyAccountsForCountry = async (countryId: string): Promise<number> => {
  return createFamilyAccountInCountryQuery(countryId).getCount();
};

export const countFamilyAccountsGlobal = async (): Promise<number> => {
  return createFamilyAccountQuery().getCount();
};

export const countChildrenCodes = async (village: Village, phase: number | undefined, whereClause?: WhereClause): Promise<number> => {
  const query = createChildrenCodesQuery();
  if (whereClause) query.where(whereClause.clause, whereClause.value);
  if (village && phase) await addPhaseFilteringToQuery(query, phase, village);
  return query.getCount();
};

export const countChildrenCodesForCountry = async (countryId: string): Promise<number> => {
  return createChildrenCodesInCountryQuery(countryId).getCount();
};

export const countChildrenCodesGlobal = async (): Promise<number> => {
  return createChildrenCodesQuery().getCount();
};

export const countConnectedFamilies = async (village: Village, phase: number | undefined, classroomId?: number): Promise<number> => {
  const query = createConnectedFamilyQuery();
  if (classroomId) query.andWhere('classroom.id = :classroomId', { classroomId });
  if (village) query.andWhere('village.id = :villageId', { villageId: village.id });
  if (village && phase) await addPhaseFilteringToQuery(query, phase, village);
  return query.getCount();
};

export const countConnectedFamiliesForCountry = async (countryId: string): Promise<number> => {
  return createConnectedFamilyInCountryQuery(countryId).getCount();
};

export const countConnectedFamiliesGlobal = async (): Promise<number> => {
  return createConnectedFamilyQuery().getCount();
};
