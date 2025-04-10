import type { MascotteData } from './mascotte.types';
import { capitalize, naturalJoin, pluralS } from 'src/utils';
import type { Country } from 'types/country.type';
import type { Currency } from 'types/currency.type';
import type { Language } from 'types/language.type';

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
  wantedForeignLanguages: [],
  minorLanguages: [],
  fluentLanguages: [],
  currencies: [],
  classImg: '',
  classImgDesc: '',
  game: '',
  sport: '',
};

export const getMascotteContent = (data: MascotteData, countries: Country[], currencies: Currency[], languages: Language[]): string[] => {
  const content: string[] = [];
  content.push(
    `Nous sommes ${data.presentation ?? 0}.\nNous sommes ${data.totalStudent ?? 0} élève${pluralS(data.totalStudent || 0)}, dont ${
      data.girlStudent ?? 0
    } fille${pluralS(data.girlStudent || 0)} et ${data.boyStudent ?? 0} garçon${pluralS(
      data.boyStudent || 0,
    )}.\nEn moyenne, l’âge des enfants de notre classe est ${data.meanAge ?? 0} an${pluralS(data.meanAge || 0)}.\nNous avons ${
      data.totalTeacher ?? 0
    } professeur${pluralS(data.totalTeacher || 0)}, dont ${data.womanTeacher ?? 0} femme${pluralS(data.womanTeacher || 0)} et ${
      data.manTeacher ?? 0
    } homme${pluralS(data.manTeacher || 0)}.\nDans notre école, il y a ${data.numberClassroom ?? 0} classe${pluralS(data.numberClassroom || 0)} et ${
      data.totalSchoolStudent ?? 0
    } élève${pluralS(data.totalSchoolStudent || 0)}.`,
  );
  const displayCountries = countries.filter((country) => data.countries.includes(country.isoCode)).map((country) => country.name);
  content.push(
    `Notre mascotte s’appelle ${data.mascotteName}, elle nous représente.\n${capitalize(data.mascotteDescription)}\n${capitalize(
      data.mascotteName,
    )} est ${data.personality1.toLowerCase()}, ${data.personality2.toLowerCase()} et ${data.personality3.toLowerCase()}.\n
    Notre mascotte rêve d’aller dans ${
      displayCountries.length > 0 ? ` ${displayCountries.length === 1 ? 'ce' : 'ces'} pays : ` + naturalJoin(displayCountries) + '.' : ' aucun pays.'
    }\nNotre mascotte joue ${data.game} et pratique ${data.sport}`,
  );

  const displayWantedLanguages = languages
    .filter((language) => data.wantedForeignLanguages.includes(language.alpha3_b))
    .map((language) => language.french);
  const displayMinorLanguages = languages.filter((language) => data.minorLanguages.includes(language.alpha3_b)).map((language) => language.french);
  const displayFluentLanguages = languages.filter((language) => data.fluentLanguages.includes(language.alpha3_b)).map((language) => language.french);
  const displayCurrencies = currencies.filter((currency) => data.currencies.includes(currency.code)).map((currency) => currency.name);
  content.push(
    `${
      displayFluentLanguages.length > 0
        ? 'Tous les enfants de notre classe parlent : ' + naturalJoin(displayFluentLanguages) + '.'
        : 'Les enfants de notre classe ne parlent aucune langue !'
    }\n${
      displayMinorLanguages.length > 0
        ? 'Au moins un enfant de notre classe parle: ' + naturalJoin(displayMinorLanguages) + '.'
        : 'Aucun enfant de notre classe ne parle de langue supplémentaire.'
    }\n${capitalize(data.mascotteName)}, comme tous les enfants de notre classe, ${
      displayWantedLanguages.length > 0 ? ' apprend : ' + naturalJoin(displayWantedLanguages) + '.' : " n'apprend aucune langue."
    }\nNous ${displayCurrencies.length > 0 ? ' utilisons comme monnaie : ' + naturalJoin(displayCurrencies) + '.' : " n'utilisons aucune monnaie."}`,
  );
  return content;
};
