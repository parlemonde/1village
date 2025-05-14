import type { VillagePhase } from '../entities/village';
import { generateEmptyFilterParams } from './helpers';
import {
  getChildrenCodesCount,
  getConnectedFamiliesCount,
  getFamiliesWithoutAccount,
  getFamilyAccountsCount,
  getFloatingAccounts,
} from './queryStatsByFilter';
import { getConnectedClassroomsCount, getContributedClassroomsCount, getRegisteredClassroomsCount } from './queryStatsByDate';
import { AppDataSource } from '../utils/data-source';
import { Country } from '../entities/country';

const countryRepository = AppDataSource.getRepository(Country);

const worldCountries = [
  { isoCode: 'AF', name: 'Afghanistan' },
  { isoCode: 'ZA', name: 'Afrique du Sud' },
  { isoCode: 'AL', name: 'Albanie' },
  { isoCode: 'DZ', name: 'Algérie' },
  { isoCode: 'DE', name: 'Allemagne' },
  { isoCode: 'AD', name: 'Andorre' },
  { isoCode: 'AO', name: 'Angola' },
  { isoCode: 'AI', name: 'Anguilla' },
  { isoCode: 'AQ', name: 'Antarctique' },
  { isoCode: 'AG', name: 'Antigua-et-Barbuda' },
  { isoCode: 'SA', name: 'Arabie saoudite' },
  { isoCode: 'AR', name: 'Argentine' },
  { isoCode: 'AM', name: 'Arménie' },
  { isoCode: 'AW', name: 'Aruba' },
  { isoCode: 'AU', name: 'Australie' },
  { isoCode: 'AT', name: 'Autriche' },
  { isoCode: 'AZ', name: 'Azerbaïdjan' },
  { isoCode: 'BS', name: 'Bahamas' },
  { isoCode: 'BH', name: 'Bahreïn' },
  { isoCode: 'BD', name: 'Bangladesh' },
  { isoCode: 'BB', name: 'Barbade' },
  { isoCode: 'BY', name: 'Biélorussie' },
  { isoCode: 'BE', name: 'Belgique' },
  { isoCode: 'BZ', name: 'Belize' },
  { isoCode: 'BJ', name: 'Bénin' },
  { isoCode: 'BM', name: 'Bermudes' },
  { isoCode: 'BT', name: 'Bhoutan' },
  { isoCode: 'BO', name: 'Bolivie' },
  { isoCode: 'BA', name: 'Bosnie-Herzégovine' },
  { isoCode: 'BW', name: 'Botswana' },
  { isoCode: 'BR', name: 'Brésil' },
  { isoCode: 'BN', name: 'Brunei' },
  { isoCode: 'BG', name: 'Bulgarie' },
  { isoCode: 'BF', name: 'Burkina Faso' },
  { isoCode: 'BI', name: 'Burundi' },
  { isoCode: 'KH', name: 'Cambodge' },
  { isoCode: 'CM', name: 'Cameroun' },
  { isoCode: 'CA', name: 'Canada' },
  { isoCode: 'CV', name: 'Cap-Vert' },
  { isoCode: 'CF', name: 'République centrafricaine' },
  { isoCode: 'CL', name: 'Chili' },
  { isoCode: 'CN', name: 'Chine' },
  { isoCode: 'CY', name: 'Chypre' },
  { isoCode: 'CO', name: 'Colombie' },
  { isoCode: 'KM', name: 'Comores' },
  { isoCode: 'CG', name: 'Congo' },
  { isoCode: 'CD', name: 'République démocratique du Congo' },
  { isoCode: 'CK', name: 'Îles Cook' },
  { isoCode: 'KR', name: 'Corée du Sud' },
  { isoCode: 'KP', name: 'Corée du Nord' },
  { isoCode: 'CR', name: 'Costa Rica' },
  { isoCode: 'CI', name: "Côte d'Ivoire" },
  { isoCode: 'HR', name: 'Croatie' },
  { isoCode: 'CU', name: 'Cuba' },
  { isoCode: 'CW', name: 'Curaçao' },
  { isoCode: 'DK', name: 'Danemark' },
  { isoCode: 'DJ', name: 'Djibouti' },
  { isoCode: 'DM', name: 'Dominique' },
  { isoCode: 'EG', name: 'Égypte' },
  { isoCode: 'AE', name: 'Émirats arabes unis' },
  { isoCode: 'EC', name: 'Équateur' },
  { isoCode: 'ER', name: 'Érythrée' },
  { isoCode: 'ES', name: 'Espagne' },
  { isoCode: 'EE', name: 'Estonie' },
  { isoCode: 'US', name: 'États-Unis' },
  { isoCode: 'ET', name: 'Éthiopie' },
  { isoCode: 'FJ', name: 'Fidji' },
  { isoCode: 'FI', name: 'Finlande' },
  { isoCode: 'FR', name: 'France' },
  { isoCode: 'GA', name: 'Gabon' },
  { isoCode: 'GM', name: 'Gambie' },
  { isoCode: 'GE', name: 'Géorgie' },
  { isoCode: 'GS', name: 'Géorgie du Sud-et-les Îles Sandwich du Sud' },
  { isoCode: 'GH', name: 'Ghana' },
  { isoCode: 'GI', name: 'Gibraltar' },
  { isoCode: 'GR', name: 'Grèce' },
  { isoCode: 'GD', name: 'Grenade' },
  { isoCode: 'GL', name: 'Groenland' },
  { isoCode: 'GP', name: 'Guadeloupe' },
  { isoCode: 'GU', name: 'Guam' },
  { isoCode: 'GT', name: 'Guatemala' },
  { isoCode: 'GG', name: 'Guernesey' },
  { isoCode: 'GN', name: 'Guinée' },
  { isoCode: 'GQ', name: 'Guinée équatoriale' },
  { isoCode: 'GW', name: 'Guinée-Bissau' },
  { isoCode: 'GY', name: 'Guyana' },
  { isoCode: 'GF', name: 'Guyane française' },
  { isoCode: 'HT', name: 'Haïti' },
  { isoCode: 'HN', name: 'Honduras' },
  { isoCode: 'HU', name: 'Hongrie' },
  { isoCode: 'BV', name: 'Île Bouvet' },
  { isoCode: 'IM', name: 'Île de Man' },
  { isoCode: 'CX', name: 'Île Christmas' },
  { isoCode: 'NF', name: 'Île Norfolk' },
  { isoCode: 'AX', name: 'Îles Åland' },
  { isoCode: 'KY', name: 'Îles Caïmans' },
  { isoCode: 'CC', name: 'Îles Cocos' },
  { isoCode: 'FO', name: 'Îles Féroé' },
  { isoCode: 'HM', name: 'Îles Heard-et-MacDonald' },
  { isoCode: 'FK', name: 'Îles Malouines' },
  { isoCode: 'MP', name: 'Îles Mariannes du Nord' },
  { isoCode: 'MH', name: 'Îles Marshall' },
  { isoCode: 'UM', name: 'Îles mineures éloignées des États-Unis' },
  { isoCode: 'PN', name: 'Îles Pitcairn' },
  { isoCode: 'SB', name: 'Îles Salomon' },
  { isoCode: 'TC', name: 'Îles Turques-et-Caïques' },
  { isoCode: 'VI', name: 'Îles Vierges américaines' },
  { isoCode: 'VG', name: 'Îles Vierges britanniques' },
  { isoCode: 'IN', name: 'Inde' },
  { isoCode: 'ID', name: 'Indonésie' },
  { isoCode: 'IQ', name: 'Irak' },
  { isoCode: 'IR', name: 'Iran' },
  { isoCode: 'IE', name: 'Irlande' },
  { isoCode: 'IS', name: 'Islande' },
  { isoCode: 'IL', name: 'Israël' },
  { isoCode: 'IT', name: 'Italie' },
  { isoCode: 'JM', name: 'Jamaïque' },
  { isoCode: 'JP', name: 'Japon' },
  { isoCode: 'JE', name: 'Jersey' },
  { isoCode: 'JO', name: 'Jordanie' },
  { isoCode: 'KZ', name: 'Kazakhstan' },
  { isoCode: 'KE', name: 'Kenya' },
  { isoCode: 'KG', name: 'Kirghizistan' },
  { isoCode: 'KI', name: 'Kiribati' },
  { isoCode: 'KW', name: 'Koweït' },
  { isoCode: 'LA', name: 'Laos' },
  { isoCode: 'LS', name: 'Lesotho' },
  { isoCode: 'LV', name: 'Lettonie' },
  { isoCode: 'LB', name: 'Liban' },
  { isoCode: 'LR', name: 'Libéria' },
  { isoCode: 'LY', name: 'Libye' },
  { isoCode: 'LI', name: 'Liechtenstein' },
  { isoCode: 'LT', name: 'Lituanie' },
  { isoCode: 'LU', name: 'Luxembourg' },
  { isoCode: 'MO', name: 'Macao' },
  { isoCode: 'MK', name: 'Macédoine du Nord' },
  { isoCode: 'MG', name: 'Madagascar' },
  { isoCode: 'MY', name: 'Malaisie' },
  { isoCode: 'MW', name: 'Malawi' },
  { isoCode: 'MV', name: 'Maldives' },
  { isoCode: 'ML', name: 'Mali' },
  { isoCode: 'MT', name: 'Malte' },
  { isoCode: 'MA', name: 'Maroc' },
  { isoCode: 'MQ', name: 'Martinique' },
  { isoCode: 'MU', name: 'Maurice' },
  { isoCode: 'MR', name: 'Mauritanie' },
  { isoCode: 'YT', name: 'Mayotte' },
  { isoCode: 'MX', name: 'Mexique' },
  { isoCode: 'FM', name: 'Micronésie' },
  { isoCode: 'MD', name: 'Moldavie' },
  { isoCode: 'MC', name: 'Monaco' },
  { isoCode: 'MN', name: 'Mongolie' },
  { isoCode: 'ME', name: 'Monténégro' },
  { isoCode: 'MS', name: 'Montserrat' },
  { isoCode: 'MZ', name: 'Mozambique' },
  { isoCode: 'MM', name: 'Myanmar' },
  { isoCode: 'NA', name: 'Namibie' },
  { isoCode: 'NR', name: 'Nauru' },
  { isoCode: 'NP', name: 'Népal' },
  { isoCode: 'NI', name: 'Nicaragua' },
  { isoCode: 'NE', name: 'Niger' },
  { isoCode: 'NG', name: 'Nigeria' },
  { isoCode: 'NU', name: 'Niue' },
  { isoCode: 'NO', name: 'Norvège' },
  { isoCode: 'NC', name: 'Nouvelle-Calédonie' },
  { isoCode: 'NZ', name: 'Nouvelle-Zélande' },
  { isoCode: 'OM', name: 'Oman' },
  { isoCode: 'UG', name: 'Ouganda' },
  { isoCode: 'UZ', name: 'Ouzbékistan' },
  { isoCode: 'PK', name: 'Pakistan' },
  { isoCode: 'PW', name: 'Palaos' },
  { isoCode: 'PS', name: 'Palestine' },
  { isoCode: 'PA', name: 'Panama' },
  { isoCode: 'PG', name: 'Papouasie-Nouvelle-Guinée' },
  { isoCode: 'PY', name: 'Paraguay' },
  { isoCode: 'NL', name: 'Pays-Bas' },
  { isoCode: 'PE', name: 'Pérou' },
  { isoCode: 'PH', name: 'Philippines' },
  { isoCode: 'PL', name: 'Pologne' },
  { isoCode: 'PF', name: 'Polynésie française' },
  { isoCode: 'PT', name: 'Portugal' },
  { isoCode: 'PR', name: 'Porto Rico' },
  { isoCode: 'QA', name: 'Qatar' },
  { isoCode: 'RE', name: 'Réunion' },
  { isoCode: 'RO', name: 'Roumanie' },
  { isoCode: 'GB', name: 'Royaume-Uni' },
  { isoCode: 'RU', name: 'Russie' },
  { isoCode: 'RW', name: 'Rwanda' },
  { isoCode: 'EH', name: 'Sahara occidental' },
  { isoCode: 'BL', name: 'Saint-Barthélemy' },
  { isoCode: 'KN', name: 'Saint-Kitts-et-Nevis' },
  { isoCode: 'SM', name: 'Saint-Marin' },
  { isoCode: 'MF', name: 'Saint-Martin' },
  { isoCode: 'PM', name: 'Saint-Pierre-et-Miquelon' },
  { isoCode: 'VC', name: 'Saint-Vincent-et-les-Grenadines' },
  { isoCode: 'SH', name: 'Sainte-Hélène' },
  { isoCode: 'LC', name: 'Sainte-Lucie' },
  { isoCode: 'WS', name: 'Samoa' },
  { isoCode: 'AS', name: 'Samoa américaines' },
  { isoCode: 'ST', name: 'Sao Tomé-et-Principe' },
  { isoCode: 'SN', name: 'Sénégal' },
  { isoCode: 'RS', name: 'Serbie' },
  { isoCode: 'SC', name: 'Seychelles' },
  { isoCode: 'SL', name: 'Sierra Leone' },
  { isoCode: 'SG', name: 'Singapour' },
  { isoCode: 'SX', name: 'Saint-Martin' },
  { isoCode: 'SK', name: 'Slovaquie' },
  { isoCode: 'SI', name: 'Slovénie' },
  { isoCode: 'SO', name: 'Somalie' },
  { isoCode: 'SD', name: 'Soudan' },
  { isoCode: 'SS', name: 'Soudan du Sud' },
  { isoCode: 'LK', name: 'Sri Lanka' },
  { isoCode: 'SE', name: 'Suède' },
  { isoCode: 'CH', name: 'Suisse' },
  { isoCode: 'SR', name: 'Suriname' },
  { isoCode: 'SJ', name: 'Svalbard et Île Jan Mayen' },
  { isoCode: 'SZ', name: 'Eswatini' },
  { isoCode: 'SY', name: 'Syrie' },
  { isoCode: 'TJ', name: 'Tadjikistan' },
  { isoCode: 'TW', name: 'Taïwan' },
  { isoCode: 'TZ', name: 'Tanzanie' },
  { isoCode: 'TD', name: 'Tchad' },
  { isoCode: 'CZ', name: 'République tchèque' },
  { isoCode: 'TF', name: 'Terres australes françaises' },
  { isoCode: 'IO', name: "Territoire britannique de l'océan Indien" },
  { isoCode: 'TH', name: 'Thaïlande' },
  { isoCode: 'TL', name: 'Timor oriental' },
  { isoCode: 'TG', name: 'Togo' },
  { isoCode: 'TK', name: 'Tokelau' },
  { isoCode: 'TO', name: 'Tonga' },
  { isoCode: 'TT', name: 'Trinité-et-Tobago' },
  { isoCode: 'TN', name: 'Tunisie' },
  { isoCode: 'TM', name: 'Turkménistan' },
  { isoCode: 'TR', name: 'Turquie' },
  { isoCode: 'TV', name: 'Tuvalu' },
  { isoCode: 'UA', name: 'Ukraine' },
  { isoCode: 'UY', name: 'Uruguay' },
  { isoCode: 'VU', name: 'Vanuatu' },
  { isoCode: 'VA', name: 'Vatican' },
  { isoCode: 'VE', name: 'Venezuela' },
  { isoCode: 'VN', name: 'Vietnam' },
  { isoCode: 'WF', name: 'Wallis-et-Futuna' },
  { isoCode: 'YE', name: 'Yémen' },
  { isoCode: 'ZM', name: 'Zambie' },
  { isoCode: 'ZW', name: 'Zimbabwe' },
];

export const populateCountries = async () => {
  // Vérifier si la table est déjà peuplée
  const count = await countryRepository.count();
  if (count > 0) {
    console.log('La table country est déjà peuplée');
    return;
  }

  // Créer les entités Country
  const countries = worldCountries.map((country) => {
    const countryEntity = new Country();
    countryEntity.isoCode = country.isoCode;
    countryEntity.name = country.name;
    return countryEntity;
  });

  // Sauvegarder les pays dans la base de données
  await countryRepository.save(countries);
  console.log(`${countries.length} pays ont été ajoutés à la base de données`);
};

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

export const getCountryStatus = async (countryId: string): Promise<'active' | 'observer' | 'ghost' | 'absent'> => {
  const threeWeeksAgo = new Date();
  threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

  // Récupérer le nombre total de classes pour ce pays
  const totalClassrooms = await getRegisteredClassroomsCount(countryId);
  if (totalClassrooms === 0) return 'absent';

  // Récupérer le nombre de classes connectées dans les 3 dernières semaines
  const recentlyConnectedClassrooms = await getConnectedClassroomsCount(countryId, threeWeeksAgo);
  const recentlyConnectedPercentage = (recentlyConnectedClassrooms / totalClassrooms) * 100;

  // Récupérer le nombre de classes qui ont contribué dans les 3 dernières semaines
  const recentlyContributedClassrooms = await getContributedClassroomsCount(countryId, threeWeeksAgo);
  const recentlyContributedPercentage = (recentlyContributedClassrooms / totalClassrooms) * 100;

  if (recentlyContributedPercentage >= 50) {
    return 'active';
  } else if (recentlyConnectedPercentage >= 50) {
    return 'observer';
  } else if (recentlyConnectedPercentage > 0) {
    return 'ghost';
  } else {
    return 'absent';
  }
};

// Fonction pour obtenir le statut de tous les pays
export const getAllCountriesStatus = async () => {
  const countries = await countryRepository.createQueryBuilder('country').select(['country.id', 'country.isoCode']).getMany();

  console.log(countries);
  const statuses = await Promise.all(
    countries.map(async (country) => ({
      iso2: country.isoCode,
      status: await getCountryStatus(country.id.toString()),
    })),
  );

  return statuses;
};
