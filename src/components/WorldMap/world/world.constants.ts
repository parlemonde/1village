import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

export const GLOBE_IMAGE_URL = '/static-images/earth-blue-marble.jpg';
export const BACKGROUND_IMAGE_URL = '/static-images/night-sky.png';
export const PELICO_IMAGE_URL = '/static-images/pelico-globe.jpg';
export const GLOBE_RADIUS = 100;
export const SKY_RADIUS = GLOBE_RADIUS * 2000;

/* camera zoom */
export const MIN_DISTANCE = 110;
export const START_DISTANCE = 310;
export const MAX_DISTANCE = 510;
export const ZOOM_DELTA = 20;

export const PELICO_USER: User = {
  accountRegistration: 0,
  firstname: '',
  lastname: '',
  language: 'FR',
  address: '',
  avatar: '/static-images/pelico-avatar.jpg',
  city: '',
  country: {
    isoCode: 'FR',
    name: 'France',
  },
  displayName: null,
  email: '',
  firstLogin: 0,
  id: 0,
  level: '',
  position: {
    lat: 46.603354, // todo
    lng: 1.8883335, // todo
  },
  postalCode: '',
  pseudo: 'Pelico',
  school: '',
  type: UserType.ADMIN, // pelico
  villageId: 0,
  village: null,
  hasAcceptedNewsletter: false,
  hasStudentLinked: false,
  featureFlags: [],
};
