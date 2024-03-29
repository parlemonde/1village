/* eslint-disable camelcase */
import stringSimilarity from 'string-similarity';

import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';
import { countries } from '../utils/iso-3166-countries-french';
import { logger } from '../utils/logger';

export type PLM_Village = {
  id: string; // number in string
  creator_id: string; // number in string
  name: string;
  slug: string; // format: 'village-monde-country1-country2'
  description: string;
  status: 'private' | 'hidden' | 'public';
  parent_id: string; // number in string
  enable_forum: string; // number in string
  date_created: string; // date "YYYY-MM-DD HH:MM:SS",
};

async function createVillage(plmVillage: PLM_Village): Promise<boolean> {
  const plmId = parseInt(plmVillage.id, 10) || 0;
  const name = plmVillage.name;
  const slug = plmVillage.slug;

  // not used villages
  if (plmVillage.status !== 'private' || plmId === 8) {
    return false;
  }

  // Check if village already exists
  const dbVillageCount = await AppDataSource.getRepository(Village).count({
    where: { plmId },
  });
  if (dbVillageCount > 0) {
    return false;
  }

  // get countries and create village
  logger.info(`Try to create village with slug: ${slug}`);
  const villageCountries = (slug.startsWith('village-monde-') ? slug.slice(14) : slug).split(/[-–]/).filter((s) => s.length > 0);
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
      newVillage.countryCodes = [countries[c1.bestMatchIndex].isoCode, countries[c2.bestMatchIndex].isoCode];
      newVillage.name = name;
      newVillage.plmId = plmId;
      await AppDataSource.getRepository(Village).save(newVillage);
      return true;
    }
  }

  const newVillage = new Village();
  newVillage.countryCodes = ['FR', 'FR'];
  newVillage.name = name;
  newVillage.plmId = plmId;
  await AppDataSource.getRepository(Village).save(newVillage);
  return true;
}

export async function createVillages(villages: PLM_Village[]): Promise<number> {
  const promises = villages.map((v) => createVillage(v));
  const results = await Promise.all(promises);
  return results.filter((r) => r).length;
}
