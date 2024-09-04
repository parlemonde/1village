import './data-source.mock';

import * as argon2 from 'argon2';

import { User, UserType } from '../../entities/user';
import { AppDataSource } from '../../utils/data-source';

async function initDatabase() {
  const fakeUser = new User();
  fakeUser.id = 1;
  fakeUser.email = 'teacher1@mail.io';
  fakeUser.pseudo = 'teacher1';
  fakeUser.firstname = '';
  fakeUser.lastname = '';
  fakeUser.level = '';
  fakeUser.school = 'Asso Par Le Monde';
  fakeUser.type = UserType.TEACHER;
  fakeUser.accountRegistration = 0;
  fakeUser.countryCode = 'fr';
  fakeUser.positionLat = '0';
  fakeUser.positionLon = '0';
  fakeUser.passwordHash = await argon2.hash('helloWorld*');
  await AppDataSource.getRepository(User).save(fakeUser);
}

// Mock the connection to the database
jest.mock('../../utils/database', () => {
  return {
    connectToDatabase: async () => {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        await initDatabase();
      }
      return true;
    },
  };
});
