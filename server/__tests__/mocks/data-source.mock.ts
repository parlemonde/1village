import path from 'path';
import { DataSource } from 'typeorm';

const appDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [path.join(__dirname, '../../entities/*.ts')],
  synchronize: true,
  logging: false,
});

// Mock the database app data source
jest.mock('../../utils/data-source', () => {
  return {
    AppDataSource: appDataSource,
  };
});
