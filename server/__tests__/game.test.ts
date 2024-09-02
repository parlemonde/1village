import './mocks';

import supertest from 'supertest';

import { getApp } from '../app';

let accessToken = '';

describe('game', () => {
  // Get the access token for the teacher
  // to be able to make authenticated requests
  beforeAll(async () => {
    const app = await getApp();
    const response = await supertest(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({
        email: 'teacher1@mail.io',
        password: 'helloWorld*',
      })
      .expect(200);
    accessToken = response.body.accessToken;
  });

  it('Get list of games (should be empty)', async () => {
    const app = await getApp();
    const response = await supertest(app).get(`/api/games`).set('authorization', `Bearer ${accessToken}`).expect(200);
    expect(response.body).toEqual([]);
  });

  // TODO: Add post request to create a game

  // TODO: Add get request to get the created game

  // TODO: Add put request to update the created game

  // TODO: Add delete request to delete the created game
});
