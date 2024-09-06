import './mocks';

import supertest from 'supertest';

import { getApp } from '../app';

describe('game', () => {
  it('Should get hello world message', async () => {
    const app = await getApp();
    await supertest(app).get('/api').expect(200);
  });

  it('Should be able to login', async () => {
    const app = await getApp();
    const response = await supertest(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({
        email: 'teacher1@mail.io',
        password: 'helloWorld*',
      })
      .expect(200);
    expect(response.body.accessToken).toBeDefined();
  });
});
