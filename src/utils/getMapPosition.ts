import type { User } from 'types/user.type';

import { axiosRequest } from './axiosRequest';

export async function getMapPosition(user: User): Promise<[number, number] | null> {
  const query = `${user.address}, ${user.city}, ${user.postalCode}, ${user.country.isoCode}`;

  // first try, all address
  let response = await axiosRequest({
    method: 'GET',
    baseURL: '',
    url: `https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(query)}&addressdetails=1&format=jsonv2`,
  });
  if (response.error) {
    return null;
  }

  // second try, only city + country
  if (response.data.length === 0) {
    response = await axiosRequest({
      method: 'GET',
      baseURL: '',
      url: `https://nominatim.openstreetmap.org/search.php?city=${encodeURIComponent(user.city)}&country=${encodeURIComponent(
        user.country.isoCode,
      )}&accept-language=fr&addressdetails=1&format=jsonv2`,
    });
  }
  if (response.error) {
    return null;
  }

  // last try, only country
  if (response.data.length === 0) {
    response = await axiosRequest({
      method: 'GET',
      baseURL: '',
      url: `https://nominatim.openstreetmap.org/search.php?country=${encodeURIComponent(
        user.country.isoCode,
      )}&accept-language=fr&addressdetails=1&format=jsonv2`,
    });
  }
  if (response.error) {
    return null;
  }

  const results = response.data as Array<{ lat: string; lon: string }>;
  if (results.length === 0) {
    return null;
  }

  return [parseFloat(results[0].lat) ?? 0, parseFloat(results[0].lon) ?? 0];
}
