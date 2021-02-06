import stringSimilarity from 'string-similarity';
import { getRepository } from 'typeorm';

import { User, UserType } from '../entities/user';
import { Village } from '../entities/village';
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
  first_name: string;
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
  role: {
    id: string; // number in string. (country id?)
    title: string; // country
    key: string; // country as well
  };
  db_error: string;
};

async function getVillage(plmId: number): Promise<Village | null> {
  try {
    // Find the village
    const dbVillage = await getRepository(Village).findOne({
      where: { plmId },
    });
    if (dbVillage) {
      return dbVillage;
    }
  } catch (error) {
    logger.error(error);
    logger.error(`Error with village (${plmId})`);
  }
  return null;
}

export async function createPLMUserToDB(plmUser: PLM_User): Promise<User> {
  // 1- Find village
  let village: Village | null = null;
  let userType = UserType.TEACHER;
  const userGroups = (plmUser.groups || []).filter((g) => parseInt(g.id, 10) !== 2 && parseInt(g.id, 10) !== 10);

  if (userGroups.length === 1) {
    village = await getVillage(parseInt(userGroups[0].id, 10) || -1);
  }
  if (userGroups.length > 1) {
    userType = UserType.OBSERVATOR;
    if (plmUser.groups.some((g) => parseInt(g.is_mod, 10) === 1)) {
      userType = UserType.MEDIATOR;
    }
    if (plmUser.groups.some((g) => parseInt(g.is_admin, 10) === 1)) {
      userType = UserType.ADMIN;
    }
  }

  // 2- Find country
  let country: string | null = null;
  if (plmUser.role && plmUser.role.title) {
    const c = stringSimilarity.findBestMatch(
      plmUser.role.title.trim().toLowerCase(),
      countries.map((c) => c.name.toLowerCase()),
    );
    if (c.bestMatch.rating > 0.88) {
      country = countries[c.bestMatchIndex].isoCode;
    }
  }
  // last fallback
  if (country === null) {
    country = 'FR';
  }
  if (village !== null && !village.countries.includes(country)) {
    country = village.countries[0];
  }

  // 3- Add user
  const user = new User();
  user.email = plmUser.user_email;
  user.pseudo = plmUser.user_login;
  user.teacherName = plmUser.display_name;
  user.level = '';
  user.school = '';
  user.villageId = village?.id || null;
  user.countryCode = country;
  user.type = userType;
  user.passwordHash = '';
  user.verificationHash = '';
  user.accountRegistration = 10;
  await getRepository(User).save(user);

  delete user.passwordHash;
  delete user.verificationHash;
  return user;
}
