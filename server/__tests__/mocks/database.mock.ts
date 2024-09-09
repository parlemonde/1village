import './data-source.mock';

import { AppDataSource } from '../../utils/data-source';
import { seedDatabase } from './../seed';

// Mock the connection to the database
jest.mock('../../utils/database', () => {
  return {
    connectToDatabase: async () => {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        await seedDatabase();
      }
      return true;
    },
  };
});
