/* eslint-disable camelcase */
import axios from 'axios';

import type { Weather } from '../../types/weather.type';
import { UserType } from '../entities/user';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { getQueryString, serializeToQueryUrl } from '../utils';
import { logger } from '../utils/logger';
import { Controller } from './controller';

// types from OpenWeather API.
type OpenWeatherResponse = {
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    message: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
};

const weatherController = new Controller('/weather');

weatherController.get({ path: '', userType: UserType.TEACHER }, async (req, res) => {
  const APP_ID = process.env.OPEN_WEATHER_APP_ID;
  if (!APP_ID) {
    throw new AppError('No open weather app id', ErrorCode.UNKNOWN);
  }

  const latitude = getQueryString(req.query.latitude);
  const longitude = getQueryString(req.query.longitude);

  if (!latitude || !longitude) {
    throw new AppError('Invalid longitude or latitude', ErrorCode.UNKNOWN);
  }

  try {
    const { data }: { data: OpenWeatherResponse } = await axios({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather${serializeToQueryUrl({
        lat: latitude,
        lon: longitude,
        appid: APP_ID,
        units: 'metric',
      })}`,
    });
    const weather: Weather = {
      timezone: data.timezone,
      temperature: data.main.temp,
      iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    };
    res.sendJSON(weather);
  } catch (e) {
    logger.error(e);
    throw new AppError('Error getting data from openweather app', ErrorCode.UNKNOWN);
  }
});

export { weatherController };
