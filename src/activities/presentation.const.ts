import { capitalize, naturalJoin, pluralS } from 'src/utils';
import { Country } from 'types/country.type';
import { Currency } from 'types/currency.type';
import { Language } from 'types/language.type';

import { MascotteData, PresentationActivity, PresentationMascotteActivity, PresentationThematiqueActivity } from './presentation.types';

export const PRESENTATION_THEMATIQUE = [
  {
    label: 'Présentation de l’école',
    description: 'Présentez votre école à vos Pélicopains',
    title: 'Faites une présentation libre de votre école',
    cardTitle: 'Présentation de notre école',
  },
  {
    label: 'Présentation de votre environnement',
    description: 'Présentez vos paysages, votre nature à vos Pélicopains',
    title: 'Faites une présentation libre de votre environnement',
    cardTitle: 'Présentation de notre environnement',
  },
  {
    label: 'Présentation de votre lieu de vie',
    description: 'Présentez votre ville/village/quartier à vos Pélicopains',
    title: 'Faites une présentation libre de votre lieu de vie',
    cardTitle: 'Présentation de notre lieu de vie',
  },
  {
    label: 'Présentation d’un loisir',
    description: 'Présentez votre activité préférée à vos Pélicopains',
    title: 'Faites une présentation libre d’un loisir',
    cardTitle: 'Présentation d’un loisir',
  },
  {
    label: 'Présentation d’un plat',
    description: 'Présentez votre plat préféré ou emblématique à vos Pélicopains',
    title: 'Faites une présentation libre d’un plat',
    cardTitle: 'Présentation d’un plat',
  },
  {
    label: 'Présentation libre',
    description: 'Faites une présentation libre',
    title: 'Faites une présentation libre',
    cardTitle: 'Présentation libre',
  },
];

export const DEFAULT_MASCOTTE_DATA: MascotteData = {
  presentation: '',
  totalStudent: 0,
  girlStudent: 0,
  boyStudent: 0,
  meanAge: 0,
  totalTeacher: 0,
  womanTeacher: 0,
  manTeacher: 0,
  numberClassroom: 0,
  totalSchoolStudent: 0,
  mascotteName: '',
  mascotteImage: '',
  mascotteDescription: '',
  personality1: '',
  personality2: '',
  personality3: '',
  countries: [],
  languages: [],
  currencies: [],
};

export const PRESENTATION = {
  THEMATIQUE: 0,
  MASCOTTE: 1,
};

export const isMascotte = (activity: PresentationActivity): activity is PresentationMascotteActivity => {
  return activity.subType === PRESENTATION.MASCOTTE;
};
export const isThematique = (activity: PresentationActivity): activity is PresentationThematiqueActivity => {
  return activity.subType === null || activity.subType === PRESENTATION.THEMATIQUE;
};

export const getMascotteContent = (data: MascotteData, countries: Country[], currencies: Currency[], languages: Language[]): string[] => {
  const content: string[] = [];
  content.push(
    `Nous sommes ${data.presentation ?? 0}.\nNous sommes ${data.totalStudent ?? 0} élève${pluralS(data.totalStudent)}, dont ${
      data.girlStudent ?? 0
    } fille${pluralS(data.girlStudent)} et ${data.boyStudent ?? 0} garçon${pluralS(
      data.boyStudent,
    )}.\nEn moyenne, l’âge des élèves de notre classe est ${data.meanAge ?? 0} an${pluralS(data.meanAge)}.\nNous avons ${
      data.totalTeacher ?? 0
    } professeur${pluralS(data.totalTeacher)}, dont ${data.womanTeacher ?? 0} femme${pluralS(data.womanTeacher)} et ${
      data.manTeacher ?? 0
    } homme${pluralS(data.manTeacher)}.\nDans notre école, il y a ${data.numberClassroom ?? 0} classe${pluralS(data.numberClassroom)} et ${
      data.totalSchoolStudent ?? 0
    } élève${pluralS(data.totalSchoolStudent)}.`,
  );

  content.push(
    `Notre mascotte s’appelle ${data.mascotteName}, elle nous représente.\n${capitalize(data.mascotteDescription)}\n${capitalize(
      data.mascotteName,
    )} est ${data.personality1.toLowerCase()}, ${data.personality2.toLowerCase()} et ${data.personality3.toLowerCase()}.`,
  );

  const displayCountries = countries.filter((country) => data.countries.includes(country.isoCode)).map((country) => country.name);
  const displayLanguages = languages.filter((language) => data.languages.includes(language.alpha3_b)).map((language) => language.french);
  const displayCurrencies = currencies.filter((currency) => data.currencies.includes(currency.code)).map((currency) => currency.name);
  content.push(
    `${capitalize(data.mascotteName)}, comme les élèves de notre classe, ${
      displayLanguages.length > 0 ? ' parle ' + naturalJoin(displayLanguages) + '.' : ' ne parle aucune langue.'
    }\n${capitalize(data.mascotteName)}, comme les élèves de notre classe, ${
      displayCurrencies.length > 0 ? ' utilise comme monnaie : ' + naturalJoin(displayCurrencies) + '.' : " n'utilise aucune monnaie."
    }\n${capitalize(data.mascotteName)}, comme les élèves de notre classe, est allé ou rêve d’aller dans ${
      displayCountries.length > 0 ? ` ${displayCountries.length === 1 ? 'ce' : 'ces'} pays : ` + naturalJoin(displayCountries) + '.' : ' aucun pays.'
    }`,
  );
  return content;
};
