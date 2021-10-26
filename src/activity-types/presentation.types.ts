import type { Activity } from 'types/activity.type';

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
  fluentLanguages: string[];
  minorLanguages: string[];
  wantedForeignLanguages: string[];
  currencies: string[];
  classImg: string;
  classImgDesc: string;
  game: string;
  sport: string;
};

export type ThematiqueData = {
  theme: number;
};

export type PresentationMascotteActivity = Activity<MascotteData>;

export type PresentationThematiqueActivity = Activity<ThematiqueData>;

export type PresentationActivity = PresentationMascotteActivity | PresentationThematiqueActivity;
