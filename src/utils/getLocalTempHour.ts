import axios from 'axios';
import country from 'country-list-js';

import { getMapPosition } from 'src/utils/getMapPosition';
import type { User } from 'types/user.type';

export async function getLocalTempHour(user: User, withWeatherIcon = false) {
  const pos = await getMapPosition(user);
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${pos[0]}&lon=${pos[1]}&appid=979023fcb2e0e3856a982a4e9608a3fa`,
  );
  const localCountry = country.findByIso2(data?.sys?.country);
  const iconUrl = `https://openweathermap.org/img/wn/${data?.weather[0].icon}@2x.png`;
  const timezone = await axios.get(
    `http://api.timezonedb.com/v2.1/get-time-zone?key=A015I79ALB6D&format=json&by=zone&zone=${localCountry.continent}/${localCountry.capital}`,
  );

  return {
    time: timezone?.data?.formatted,
    temp: data?.main?.temp - 273.15, // Kelvin to celsius conversion
    iconUrl: withWeatherIcon && iconUrl,
  };
}
