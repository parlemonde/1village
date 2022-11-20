import supertest from 'supertest';

import { getApp } from '../app';

/**
 * function to create a token for the use of PLM's api
 * @param auth empty object with token string property
 * @returns auth with token inside
 */
export function loginUser(auth: { token: string }) {
  return async function () {
    const app = await getApp();
    supertest(app)
      .post('/login')
      .send({
        email: 'teacher1@mail.io',
        password: 'helloWorld*',
      })
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        return (auth.token = res.body.token);
      });
  };
}
/**
 * Mock for fake user to the response for login request
 */
export const fakeUser = {
  id: 1,
  email: 'teacher1@mail.io',
  pseudo: 'teacher1',
  level: 'CM1',
  school: 'École polyvalente publique Tandou',
  city: 'Paris',
  postalCode: '75019',
  address: '16 Rue Tandou, 75019 Paris',
  avatar: null,
  displayName: null,
  accountRegistration: 0,
  passwordHash: '$argon2i$v=19$m=16,t=2,p=1$cTY0aFpyUmF2ZkhERnRSQQ$j7XF79KQqmGGay1bqtxNuQ',
  firstLogin: 3,
  type: 0,
  villageId: 1,
  country: { isoCode: 'FR', name: 'France' },
  position: { lat: 48.8863442, lng: 2.380321 },
};
