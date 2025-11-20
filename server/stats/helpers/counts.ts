import type { WhereClause } from '../../../types/statistics.type';
import type { Village, VillagePhase } from '../../entities/village';
import { addPhaseFilteringToQuery } from './addPhaseFilteringToQuery.helper';
import { createChildrenCodesInCountryQuery as createChildrenCodesInCountryQuery, createChildrenCodesQuery } from './createChildrenCodesQuery.helper';
import { createConnectedFamilyQuery, createConnectedFamilyInCountryQuery } from './createConnectedFamilyQuery.helper';
import {
  createFamilyAccountInCountryQuery as createFamilyAccountInCountryQuery,
  createFamilyAccountInVillageQuery,
  createFamilyAccountQuery,
} from './createFamilyAccountQuery.helper';

export const countFamilyAccounts = async (village: Village, phase: number | undefined): Promise<number> => {
  const query = createFamilyAccountInVillageQuery(village.id);

  if (village && phase) await addPhaseFilteringToQuery(query, phase, village);

  return query.getCount();
};

export const countFamilyAccountsForCountry = async (countryId: string, phase?: number): Promise<number> => {
  return createFamilyAccountInCountryQuery(countryId, phase).getCount();
};

export const countFamilyAccountsGlobal = async (phase?: VillagePhase): Promise<number> => {
  return createFamilyAccountQuery(phase).getCount();
};

export const countChildrenCodes = async (village: Village, phase: number | undefined, whereClause?: WhereClause): Promise<number> => {
  const query = createChildrenCodesQuery();

  if (whereClause) query.where(whereClause.clause, whereClause.value);
  if (village && phase) await addPhaseFilteringToQuery(query, phase, village);

  return query.getCount();
};

export const countChildrenCodesForCountry = async (countryId: string, phase?: number): Promise<number> => {
  return createChildrenCodesInCountryQuery(countryId, phase).getCount();
};

export const countChildrenCodesGlobal = async (phase?: VillagePhase): Promise<number> => {
  return createChildrenCodesQuery(phase).getCount();
};

export const countConnectedFamilies = async (village: Village, phase: number | undefined, classroomId?: number): Promise<number> => {
  const query = createConnectedFamilyQuery();

  if (classroomId) query.andWhere('classroom.id = :classroomId', { classroomId });
  if (village) query.andWhere('village.id = :villageId', { villageId: village.id });
  if (village && phase) await addPhaseFilteringToQuery(query, phase, village);

  return query.getCount();
};

export const countConnectedFamiliesForCountry = async (countryId: string, phase?: number): Promise<number> => {
  return createConnectedFamilyInCountryQuery(countryId, phase).getCount();
};

export const countConnectedFamiliesGlobal = async (phase?: VillagePhase): Promise<number> => {
  return createConnectedFamilyQuery(phase).getCount();
};
