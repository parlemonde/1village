import './mocks';

import supertest from 'supertest';

import { seedDatabase } from '../__tests__/seed';
import { getApp } from '../app';
import { hasSubscribed } from '../emails/checkSubscribe';
import { Notifications } from '../entities/notifications';
import { User } from '../entities/user';
import { AppDataSource } from '../utils/data-source';

let accessToken = '';

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

  it("hasSubscribed should send false if the user's commentary is false", async () => {
    const userRepository = AppDataSource.getRepository(User);
    const notificationsRepository = AppDataSource.getRepository(Notifications);

    // Récupération de l'utilisateur teacher2 qui a commentary à false
    const user = await userRepository.findOneBy({ email: 'teacher2@mail.io' });
    expect(user).toBeDefined();

    const id = user?.id;

    // Récupération des règles de notifications pour cet utilisateur
    const notificationRules = await notificationsRepository.findOneBy({ userId: id });
    expect(notificationRules).toBeDefined();

    expect(notificationRules?.commentary).toBe(false);

    const emailType = 1;
    const activityCreator = user;
    const column = 'commentary';

    const result = hasSubscribed({
      emailType,
      notificationRules,
      activityCreator,
      column,
    });

    expect(result).toBe(false);
  });

  it("hasSubscribed should send true if the user's commentary is false", async () => {
    const userRepository = AppDataSource.getRepository(User);
    const notificationsRepository = AppDataSource.getRepository(Notifications);

    // Récupération de l'utilisateur teacher3 qui a commentary à true
    const user = await userRepository.findOneBy({ email: 'teacher3@mail.io' });
    expect(user).toBeDefined();

    const id = user?.id;

    // Récupération des règles de notifications pour cet utilisateur
    const notificationRules = await notificationsRepository.findOneBy({ userId: id });
    expect(notificationRules).toBeDefined();

    expect(notificationRules?.commentary).toBe(true);

    const emailType = 1;
    const activityCreator = user;
    const column = 'commentary';

    const result = hasSubscribed({
      emailType,
      notificationRules,
      activityCreator,
      column,
    });

    expect(result).toBe(true);
  });
});
