import { formatDate } from 'src/utils';
import type { FamiliesWithoutAccount, FloatingAccount, OneVillageTableRow } from 'types/statistics.type';

export function createFamiliesWithoutAccountRows(data: FamiliesWithoutAccount[]): OneVillageTableRow[] {
  return data.map((row) => ({
    id: row.student_id,
    student: `${row.student_firstname} ${row.student_lastname}`,
    vm: row.village_name,
    classroom: row.classroom_name,
    country: row.classroom_country,
    creationDate: row.student_creation_date ? formatDate(row.student_creation_date) : 'Donnée non disponible',
  }));
}

export function createFloatingAccountsRows(data: FloatingAccount[]): OneVillageTableRow[] {
  return data.map((row) => ({
    id: row.id,
    family: `${row.firstname} ${row.lastname}`,
    language: row.language,
    email: row.email,
    creationDate: row.createdAt ? formatDate(row.createdAt) : 'Donnée non disponible',
  }));
}
