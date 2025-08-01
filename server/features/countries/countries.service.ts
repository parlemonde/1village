import { countries } from '../../utils/iso-3166-countries-french';
import { selectCountriesOfVillages } from './countries.repository';

export const getCountries = async (hasVillage: boolean) => {
  if (!hasVillage) {
    return countries;
  }

  const request = await selectCountriesOfVillages();

  const setCountryCodes = new Set(request.flatMap((obj) => obj.countryCodes.split(',')));

  const filteredCountries = countries.filter((country) => {
    return setCountryCodes.has(country.isoCode);
  });

  return filteredCountries;
};
