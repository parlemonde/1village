/* eslint-disable camelcase */
import stringSimilarity from 'string-similarity';
import { In } from 'typeorm';

import { UserType } from '../../types/user.type';
import { Country } from '../entities/country';
import { User } from '../entities/user';
import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';
import { setUserPosition } from '../utils/get-pos';
import { countries } from '../utils/iso-3166-countries-french';
import { logger } from '../utils/logger';

export type PLM_User = {
  id: string;
  email: string;
  peuso: string;
  school: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  groups: Array<{
    name: string; // village name
    id: string; // number in string, village id
    is_admin: string; // boolean in string ("0" or "1")
    is_mod: string; // boolean in string ("0" or "1")
    user_title: string;
  }>;
};

const MEDIATEUR_GROUP_ID = 10;

async function getVillage(plmIds: number[]): Promise<Village | null> {
  try {
    // Find the village
    const dbVillage = await AppDataSource.getRepository(Village).findOne({
      where: { plmId: In(plmIds) },
    });
    if (dbVillage) {
      return dbVillage;
    }
  } catch (error) {
    logger.error(error);
    logger.error(`Error no villages (${plmIds})`);
  }
  return null;
}

export async function createPLMUserToDB(plmUser: PLM_User): Promise<User> {
  let village: Village | null = null;
  let countryCode: string = 'FR';
  let userType = UserType.TEACHER;
  const userGroups = plmUser.groups || [];
  const groupIds = userGroups.map((g) => parseInt(g.id, 10)).filter((n) => !Number.isNaN(n));

  // 1- Find village
  if (groupIds.length > 0) {
    village = await getVillage(groupIds);
  }
  if (groupIds.includes(MEDIATEUR_GROUP_ID)) {
    userType = UserType.OBSERVATOR;
  }

  // 2- Find country
  if (plmUser.country) {
    const matchs = village !== null ? village.countries : countries;
    const c = stringSimilarity.findBestMatch(
      plmUser.country?.trim().toLowerCase(),
      matchs.map((c) => c.name.toLowerCase()),
    );
    if (c.bestMatch.rating > 0.55) {
      countryCode = matchs[c.bestMatchIndex].isoCode;
    }
  }
  if (village !== null && !village.countries.map((e) => e.isoCode).includes(countryCode)) {
    countryCode = village.countries[0].isoCode;
  }

  // 3- Add user
  const user = new User();
  user.email = plmUser.email;
  user.pseudo = plmUser.peuso;
  user.level = '';
  user.school = plmUser.school || '';
  user.city = plmUser.city || '';
  user.postalCode = plmUser.postalCode || '';
  user.address = plmUser.address || '';
  user.villageId = village?.id || null;
  const countryFound = await AppDataSource.getRepository(Country).findOne({ where: { isoCode: countryCode } });
  user.country = countryFound ?? null;
  user.type = userType;
  user.passwordHash = '';
  user.verificationHash = '';
  user.accountRegistration = 10;
  user.positionLat = 0;
  user.positionLon = 0;

  await setUserPosition(user);
  await AppDataSource.getRepository(User).save(user);

  delete user.passwordHash;
  delete user.verificationHash;
  return user;
}
