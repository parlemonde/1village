import * as argon2 from 'argon2';

import { Activity } from '../entities/activity';
import { Notifications } from '../entities/notifications';
import { User, UserType } from '../entities/user';
import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';

async function createFakeVillage(): Promise<Village> {
  const village = new Village();

  village.plmId = null;
  village.name = 'Village Test';
  village.countryCodes = ['FR', 'ES'];
  village.activePhase = 2;

  return village;
}

async function createFakeUser(email: string, pseudo: string, password: string, villageId: number): Promise<User> {
  const user = new User();
  user.id = Math.floor(Math.random() * 1000);
  user.email = email;
  user.pseudo = pseudo;
  user.firstname = '';
  user.lastname = '';
  user.level = '';
  user.school = 'Asso Par Le Monde';
  user.villageId = villageId;
  user.type = UserType.TEACHER;
  user.accountRegistration = 0;
  user.countryCode = 'fr';
  user.positionLat = '0';
  user.positionLon = '0';
  user.passwordHash = await argon2.hash(password);
  return user;
}

async function createFakeNotifications(userId: number, commentary: boolean): Promise<Notifications> {
  const notifications = new Notifications();
  notifications.userId = userId;
  notifications.commentary = commentary;
  notifications.reaction = true;
  notifications.publicationFromSchool = true;
  notifications.publicationFromAdmin = true;
  notifications.creationAccountFamily = true;
  notifications.openingVillageStep = true;
  return notifications;
}

async function createFakeActivity(userId: number, villageId: number): Promise<Activity> {
  const activity = new Activity();
  activity.userId = userId;
  activity.villageId = villageId;
  activity.type = 6;
  activity.subType = 7;
  activity.phase = 2;
  activity.status = 1;
  activity.createDate = new Date();
  activity.publishDate = new Date();
  activity.updateDate = new Date();
  activity.data = { theme: 0, draftUrl: '/indice-culturel/2' };
  activity.content = [{ id: 0, type: 'text', value: '<p>Une tradition Portugaise A</p>\n' }];
  activity.isPinned = false;
  activity.isVisibleToParent = true;
  return activity;
}

export async function seedDatabase() {
  const userRepository = AppDataSource.getRepository(User);
  const notificationsRepository = AppDataSource.getRepository(Notifications);
  const activityRepository = AppDataSource.getRepository(Activity);
  const villageRepository = AppDataSource.getRepository(Village);

  const village = await createFakeVillage();
  const savedVillage = await villageRepository.save(village);

  const users = [
    { email: 'teacher1@mail.io', pseudo: 'teacher1', password: 'helloWorld*', commentary: true },
    { email: 'teacher2@mail.io', pseudo: 'teacher2', password: 'helloWorld*', commentary: false },
    { email: 'teacher3@mail.io', pseudo: 'teacher3', password: 'helloWorld*', commentary: true },
  ];

  for (const userData of users) {
    const existingUser = await userRepository.findOneBy({ email: userData.email });

    if (!existingUser) {
      const user = await createFakeUser(userData.email, userData.pseudo, userData.password, savedVillage.id);
      const savedUser = await userRepository.save(user);

      const notifications = await createFakeNotifications(savedUser.id, userData.commentary);
      await notificationsRepository.save(notifications);

      if (userData.email === 'teacher2@mail.io' || userData.email === 'teacher3@mail.io') {
        const activity = await createFakeActivity(savedUser.id, savedVillage.id);
        await activityRepository.save(activity);
      }
    }
  }
}
