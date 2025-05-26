import { countries } from '../../utils/iso-3166-countries-french';
import { selectCountriesWithVillages } from './countries.repository';

export const getCountriesWithVillages = async () => {
  const countryCodesWithVillages = (await selectCountriesWithVillages()).map((obj) => obj.countryCode);
  return countries.filter((country) => {
    return countryCodesWithVillages.includes(country.isoCode);
  });
};
