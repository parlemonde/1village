import path from 'path';
import request from 'supertest';
import { createConnection } from 'typeorm';

import { getApp } from '../app';

// Mock database to create a in-memory db for testing.
export const connectToDatabase = async () => {
  return createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [path.join(__dirname, '../entities/*.js')],
    synchronize: true,
    logging: false,
  });
};

export async function getTokenMock() {
  let token = 'your token';
  const app = await getApp();
  await request(app)
    .post('/login')
    .set('Accept', 'application/json')
    .end(function (err, res) {
      if (err) throw err;
      token = res.body.accessToken;
    });
  return token;
}
