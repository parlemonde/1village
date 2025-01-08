import { countryToFlag } from 'src/utils';
import type { OneVillageTableRow } from 'types/statistics.type';
import type { User } from 'types/user.type';
import { userTypeNames } from 'types/user.type';

export function createUsersRows(data: User[]): OneVillageTableRow[] {
  console.log(data);
  return data.map((row) => ({
    id: row.id,
    firstname: row.firstname,
    lastname: row.lastname,
    email: row.email,
    school: row.school,
    village: row.village?.id ?? 'Pas de village',
    country: row.country ? `${countryToFlag(row.country.isoCode)} ${row.country?.name}` : '',
    role: userTypeNames[row.type],
  }));
}
