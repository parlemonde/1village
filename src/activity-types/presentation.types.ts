import type { GenericExtendedActivity } from './extendedActivity.types';

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
  countries: string[];
  languages: string[];
  currencies: string[];
};

export type ThematiqueData = {
  theme: number;
};

export type PresentationMascotteActivity = GenericExtendedActivity<MascotteData>;

export type PresentationThematiqueActivity = GenericExtendedActivity<ThematiqueData>;

export type PresentationActivity = PresentationMascotteActivity | PresentationThematiqueActivity;
