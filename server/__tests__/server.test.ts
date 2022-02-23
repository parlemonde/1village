import request from 'supertest';
import { createConnection } from 'typeorm';

import { getApp } from '../app';

jest.mock('./../utils/database', () => {
  const originalModule = jest.requireActual('./../utils/database');

  //Simule l'exportation par défaut et l'exportation nommée 'foo'
  return {
    __esModule: true,
    ...originalModule,
    connectToDatabase: async () => {
      return createConnection({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        // entities: [MyEntity],
        synchronize: true,
        logging: false,
      });
    },
  };
});

describe('test entry point ', () => {
  it('should return 200', async () => {
    const app = await getApp();
    const response = await request(app).get('/api').set('Accept', 'application/json');
   console.log(response);
    expect(response.status).toBe(200);
  });
});
