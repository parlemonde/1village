import './mocks';

import supertest from 'supertest';

import { getApp } from '../app';

let accessToken = '';

describe('Notification api test', () => {
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

  it('should return notifications à jour', async () => {
    const id = '1';
    const app = await getApp();
    const response = await supertest(app).put(`/api/notifications/suscribe/${id}`).set('authorization', `Bearer ${accessToken}`).expect(200);
    expect(response.body).toEqual({ message: 'Notifications à jour' });
  });
});
