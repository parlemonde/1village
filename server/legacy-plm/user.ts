/* eslint-disable camelcase */
import stringSimilarity from 'string-similarity';
import { getRepository, In } from 'typeorm';

import { User, UserType } from '../entities/user';
import { Village } from '../entities/village';
import { setUserPosition } from '../utils/get-pos';
import { countries } from '../utils/iso-3166-countries-french';
import { logger } from '../utils/logger';

export type PLM_User = {
  ID: string; // number in string
  user_login: string;
  user_nicename: string;
  user_email: string;
  user_registered: string; // date "YYYY-MM-DD HH:MM:SS",
  user_status: string; // number in string
  display_name: string;
  spam: string; // boolean in string ("0" or "1")
  deleted: string; // boolean in string ("0" or "1")
  country: string;
  groups: Array<{
    name: string; // village name
    id: string; // number in string, village id
    is_admin: string; // boolean in string ("0" or "1")
    is_mod: string; // boolean in string ("0" or "1")
    user_title: string;
  }>;
  meta: Array<{
    key: string;
    value: string; // can be a number
  }>;
  db_error: string;
};

const MEDIATEUR_GROUP_ID = 10;

async function getVillage(plmIds: number[]): Promise<Village | null> {
  try {
    // Find the village
    const dbVillage = await getRepository(Village).findOne({
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

function getMetaValue(plmUser: PLM_User, key: string): string {
  return (plmUser.meta ?? []).find((meta) => meta.key.toLowerCase() === key.toLowerCase())?.value ?? '';
}

export async function createPLMUserToDB(plmUser: PLM_User): Promise<User> {
  // 1- Find village
  let village: Village | null = null;
  let userType = UserType.TEACHER;
  const userGroups = plmUser.groups || [];
  const groupIds = userGroups.map((g) => parseInt(g.id, 10)).filter((n) => !Number.isNaN(n));

  if (groupIds.length > 0) {
    village = await getVillage(groupIds);
  }
  if (groupIds.includes(MEDIATEUR_GROUP_ID)) {
    userType = UserType.OBSERVATOR;
  }

  // 2- Find country
  let country: string | null = null;
  if (plmUser.country) {
    const matchs = village !== null ? village.countries : countries;
    const c = stringSimilarity.findBestMatch(
      plmUser.country.trim().toLowerCase(),
      matchs.map((c) => c.name.toLowerCase()),
    );
    if (c.bestMatch.rating > 0.88) {
      country = matchs[c.bestMatchIndex].isoCode;
    }
  }
  // last fallback
  if (country === null) {
    country = 'FR';
  }
  if (village !== null && !village.countryCodes.includes(country)) {
    country = village.countryCodes[0];
  }

  // 3- Add user
  const user = new User();
  user.email = plmUser.user_email;
  user.pseudo = plmUser.user_login;
  user.level = '';
  user.school = getMetaValue(plmUser, "Nom de l'école");
  user.city = getMetaValue(plmUser, 'Ville') || getMetaValue(plmUser, 'Académie');
  user.postalCode = getMetaValue(plmUser, "Code postal de l'école");
  user.address = getMetaValue(plmUser, 'Rue');
  user.villageId = village?.id || null;
  user.countryCode = country;
  user.type = userType;
  user.passwordHash = '';
  user.verificationHash = '';
  user.accountRegistration = 10;
  user.position = { lat: 0, lng: 0 };
  await setUserPosition(user);
  await getRepository(User).save(user);

  delete user.passwordHash;
  delete user.verificationHash;
  return user;
}
