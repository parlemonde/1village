import { Country } from 'types/country.type';
import { Currency } from 'types/currency.type';
import { Language } from 'types/language.type';

export type MascotteData = {
  presentation: string;
  totalStudent: number | null;
  girlStudent: number | null;
  boyStudent: number | null;
  meanAge: number | null;
  totalTeacher: number | null;
  womanTeacher: number | null;
  manTeacher: number | null;
  numberClassroom: number | null;
  totalSchoolStudent: number | null;
  mascotteName: string;
  mascotteImage: string;
  mascotteDescription: string;
  personality1: string;
  personality2: string;
  personality3: string;
  countries: Country[];
  languages: Language[];
  currencies: Currency[];
};
