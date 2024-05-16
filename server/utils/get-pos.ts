import axios from 'axios';

import type { User } from '../entities/user';
import { serializeToQueryUrl } from '../utils';

type NominatimResponse = Array<{ lat: string; lon: string }>;
type NominatimQuery =
  | {
      q: string;
    }
  | {
      city?: string;
      country: string;
    };

export async function getPosition(query: NominatimQuery): Promise<{ lat: number; lng: number } | null> {
  try {
    const { data }: { data: NominatimResponse } = await axios({
      method: 'GET',
      url: `https://nominatim.openstreetmap.org/search.php${serializeToQueryUrl({
        ...query,
        addressdetails: 1,
        format: 'jsonv2',
        'accept-language': 'fr',
      })}`,
    });
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat) || 0, lng: parseFloat(data[0].lon) || 0 };
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function setUserPosition(user: User): Promise<void> {
  const query = `${user.address}, ${user.city}, ${user.postalCode}, ${user.country?.name}`;

  const pos =
    (await getPosition({ q: query })) ||
    (await getPosition({ city: user.city, country: user.country?.name })) ||
    (await getPosition({ country: user.country?.name }));
  if (pos !== null) {
    user.position = pos;
    return;
  }
}
