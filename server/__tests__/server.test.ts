import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import path from 'path';
import request from 'supertest';
import { createConnection } from 'typeorm';

import { getApp } from '../app';

// Mock database to create a in-memory db for testing.
jest.mock('../utils/database', () => ({
  __esModule: true,
  connectToDatabase: async () => {
    return createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [path.join(__dirname, '../entities/*.js')],
      synchronize: true,
      logging: false,
    });
  },
}));

// Mock frontend NextJS library. We don't need it for testing.
jest.mock('next', () => ({
  __esModule: true,
  default: () => ({
    getRequestHandler: () => (_req: ExpressRequest, res: ExpressResponse) => {
      res.sendJSON({ isFrontend: true });
    },
    prepare: () => Promise.resolve(),
  }),
}));

describe('test entry point ', () => {
  it('should return 200', async () => {
    const app = await getApp();
    const response = await request(app).get('/api').set('Accept', 'application/json');
    expect(response.status).toBe(200);
  });
});
