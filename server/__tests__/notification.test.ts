import './mocks';

import supertest from 'supertest';

import { seedDatabase } from '../__tests__/seed';
import { getApp } from '../app';
// import { Activity } from '../entities/activity';
import { Notifications } from '../entities/notifications';
import { User } from '../entities/user';
import { AppDataSource } from '../utils/data-source';

let accessToken = '';

jest.mock('../emails/index', () => ({
  sendMail: jest.fn(),
}));

describe('Notification api test', () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    await seedDatabase();

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

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email: 'teacher1@mail.io' });
    expect(user).not.toBeNull();
  });

  it("should return notification's user update", async () => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email: 'teacher1@mail.io' });

    const id = user?.id;
    const app = await getApp();

    const updateData = {
      commentary: false,
      reaction: false,
      publicationFromSchool: false,
      publicationFromAdmin: false,
      creationAccountFamily: false,
      openingVillageStep: false,
    };

    const response = await supertest(app)
      .put(`/api/notifications/suscribe/${id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .send({ data: updateData })
      .expect(200);

    expect(response.body).toEqual({ message: 'Notifications mises à jour' });

    const notificationsRepository = AppDataSource.getRepository(Notifications);
    const updatedNotifications = await notificationsRepository.findOneBy({ userId: Number(id) });

    expect(updatedNotifications).toMatchObject(updateData);
  });

  // TODO: Add a request with a user with commentary to true and expect received a mail

  it("Should not send a mail if the user's commentary is false", async () => {
    // vérifie si hasSubscribed retorune true ou false en fonvtion de si l'utilisateur a souscrit ou non
    // const userRepository = AppDataSource.getRepository(User);
    // Using teacher2 because he has commentary set to false
    // const user = await userRepository.findOneBy({ email: 'teacher2@mail.io' });
    // const id = user?.id;
    // const notificationsRepository = AppDataSource.getRepository(Notifications);
    // const notifications = await notificationsRepository.findOneBy({ userId: id });
    // const activityRepository = AppDataSource.getRepository(Activity);
    // const activity = await activityRepository.findOneBy({ userId: id });
    // const app = await getApp();
  });
});
