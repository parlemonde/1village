import stringSimilarity from "string-similarity";
import { getRepository } from "typeorm";

import { User, UserType } from "../../entities/user";
import { Village } from "../../entities/village";
import { countries } from "../../utils/iso-3166-countries-french";

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

async function getVillage(id: number, name: string): Promise<Village | null> {
  // First find the village
  const dbVillage = await getRepository(Village).findOne({
    where: [{ plmoId: id }, { name }],
  });
  if (dbVillage) {
    return dbVillage;
  }
  const allVillages = await getRepository(Village).find();
  const similarities = stringSimilarity.findBestMatch(
    name,
    allVillages.map((v) => v.name),
  );
  if (similarities.bestMatch.rating > 0.88) {
    return allVillages[similarities.bestMatchIndex] || null;
  }

  // Otherwise create it.
  const villageCountries = (name.toLowerCase().startsWith("village monde") ? name.slice(14) : name).split(/[-–]/).filter((s) => s.length > 0);
  if (villageCountries.length === 2) {
    const c1 = stringSimilarity.findBestMatch(
      villageCountries[0].trim(),
      countries.map((c) => c.name),
    );
    const c2 = stringSimilarity.findBestMatch(
      villageCountries[1].trim(),
      countries.map((c) => c.name),
    );
    if (c1.bestMatch.rating > 0.88 && c2.bestMatch.rating > 0.88) {
      const newVillage = new Village();
      newVillage.countries = [countries[c1.bestMatchIndex].isoCode, countries[c2.bestMatchIndex].isoCode];
      newVillage.name = name;
      newVillage.plmoId = id;
      await getRepository(Village).save(newVillage);
      return newVillage;
    }
  }
  return null;
}

export async function createPLMUserToDB(plmUser: PLM_User): Promise<User> {
  // 1- Find village
  let village: Village | null = null;
  if (plmUser.groups && plmUser.groups.length === 1) {
    village = await getVillage(parseInt(plmUser.groups[0].id, 10) || -1, plmUser.groups[0].name);
  }

  // 2- Find country
  let country: string | null = null;
  if (plmUser.role && plmUser.role.title) {
    const c = stringSimilarity.findBestMatch(
      plmUser.role.title.trim(),
      countries.map((c) => c.name),
    );
    if (c.bestMatch.rating > 0.88) {
      country = countries[c.bestMatchIndex].isoCode;
    }
  }
  // last fallback
  if (country === null) {
    country = "FR";
  }
  if (village !== null && !village.countries.includes(country)) {
    country = village.countries[0];
  }

  // 3- Add user
  const user = new User();
  user.email = plmUser.user_email;
  user.pseudo = plmUser.user_login;
  user.teacherName = plmUser.display_name;
  user.level = "";
  user.school = "";
  user.villageId = village?.id || null;
  user.countryCode = country;
  user.type = UserType.TEACHER;
  user.passwordHash = "";
  user.verificationHash = "";
  user.accountRegistration = 10;
  await getRepository(User).save(user);
  return user;
}
