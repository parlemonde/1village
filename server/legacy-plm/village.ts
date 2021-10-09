/* eslint-disable camelcase */
import stringSimilarity from 'string-similarity';
import { getRepository } from 'typeorm';

import { Village } from '../entities/village';
import { countries } from '../utils/iso-3166-countries-french';
import { logger } from '../utils/logger';

export type PLM_Village = {
  id: string; // number in string
  creator_id: string; // number in string
  name: string;
  slug: string;
  description: string;
  status: string;
  parent_id: string; // number in string
  enable_forum: string; // number in string
  date_created: string; // date "YYYY-MM-DD HH:MM:SS",
};

async function createVillage(plmVillage: PLM_Village): Promise<boolean> {
  const plmId = parseInt(plmVillage.id, 10) || 0;
  const name = plmVillage.name;

  // not used villages
  if (plmId === 2 || plmId === 10) {
    return false;
  }

  // Check if village already exists
  const dbVillageCount = await getRepository(Village).count({
    where: { plmId },
  });
  if (dbVillageCount > 0) {
    return false;
  }

  // get countries and create village
  logger.info(`Try to create village with name: ${name}`);
  const villageCountries = (name.toLowerCase().startsWith('village monde') ? name.slice(14) : name).split(/[-–]/).filter((s) => s.length > 0);
  if (villageCountries.length === 2) {
    const c1 = stringSimilarity.findBestMatch(
      villageCountries[0].trim().toLowerCase(),
      countries.map((c) => c.name.toLowerCase()),
    );
    const c2 = stringSimilarity.findBestMatch(
      villageCountries[1].trim().toLowerCase(),
      countries.map((c) => c.name.toLowerCase()),
    );
    logger.info(`c1: ${JSON.stringify(c1.bestMatch)}`);
    logger.info(`c2: ${JSON.stringify(c2.bestMatch)}`);
    if (c1.bestMatch.rating > 0.88 && c2.bestMatch.rating > 0.88) {
      const newVillage = new Village();
      newVillage.countries = [countries[c1.bestMatchIndex].isoCode, countries[c2.bestMatchIndex].isoCode];
      newVillage.name = name;
      newVillage.plmId = plmId;
      await getRepository(Village).save(newVillage);
      return true;
    }
  }

  const newVillage = new Village();
  newVillage.countries = ['FR', 'FR'];
  newVillage.name = name;
  newVillage.plmId = plmId;
  await getRepository(Village).save(newVillage);
  return true;
}

export async function createVillages(villages: PLM_Village[]): Promise<number> {
  const promises = villages.map((v) => createVillage(v));
  const results = await Promise.all(promises);
  return results.filter((r) => r).length;
}
