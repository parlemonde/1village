import * as argon2 from 'argon2';

import { Notifications } from '../entities/notifications'; // Assure-toi d'importer la bonne entité
import { User, UserType } from '../entities/user';
import { AppDataSource } from '../utils/data-source';

async function createFakeUser(email: string, pseudo: string, password: string): Promise<User> {
  const user = new User();
  user.email = email;
  user.pseudo = pseudo;
  user.firstname = '';
  user.lastname = '';
  user.level = '';
  user.school = 'Asso Par Le Monde';
  user.type = UserType.TEACHER;
  user.accountRegistration = 0;
  user.countryCode = 'fr';
  user.positionLat = '0';
  user.positionLon = '0';
  user.passwordHash = await argon2.hash(password);
  return user;
}

async function createFakeNotifications(userId: number): Promise<Notifications> {
  const notifications = new Notifications();
  notifications.userId = userId;
  notifications.commentary = true;
  notifications.reaction = true;
  notifications.publicationFromSchool = true;
  notifications.publicationFromAdmin = true;
  notifications.creationAccountFamily = true;
  notifications.openingVillageStep = true;
  return notifications;
}

export async function seedDatabase() {
  const userRepository = AppDataSource.getRepository(User);
  const notificationsRepository = AppDataSource.getRepository(Notifications);

  const users = [
    { email: 'teacher1@mail.io', pseudo: 'teacher1', password: 'helloWorld*' },
    { email: 'teacher2@mail.io', pseudo: 'teacher2', password: 'helloWorld*' },
  ];

  for (const userData of users) {
    const existingUser = await userRepository.findOneBy({ email: userData.email });

    if (!existingUser) {
      const user = await createFakeUser(userData.email, userData.pseudo, userData.password);
      const savedUser = await userRepository.save(user);

      const notifications = await createFakeNotifications(savedUser.id);
      await notificationsRepository.save(notifications);
    }
  }
}

// const userAdmin = {
//   id: 1,
//   email: 'admin.1village@parlemonde.org',
//   pseudo: 'PLMO1_admin',
//   firstname: 'Admin',
//   lastname: '1Village',
//   level: '',
//   school: 'Asso Par Le Monde',
//   city: 'Paris',
//   postalCode: '75000',
//   adress: '4 avenue Victoria',
//   avatar: '',
//   displayName: 'Admin 1Village',
//   hasAcceptedNewsletter: false,
//   language: 'français',
//   accountRegistration: 0,
//   passwordHash: 'helloWorld*',
//   verificationHash: '',
//   isVerified: true,
//   firstLogin: 1,
//   villageId: null,
//   countryCode: 'FR',
//   positionLat: '48.8588443',
//   positionLon: '2.3469112',
//   hasStudentLinked: false,
//   type: 0,
// };

// const userTeacher1 = {
//   id: 2,
//   email: 'prof_fr_a@mail.fr',
//   pseudo: 'Prof FR A',
//   firstname: 'Prof',
//   lastname: 'FR A',
//   level: 'CP',
//   school: 'Ecole FR A',
//   city: 'Paris',
//   postalCode: '75000',
//   adress: '1 avenue Victoria',
//   avatar: '',
//   displayName: 'Prof FR A 1Village',
//   hasAcceptedNewsletter: false,
//   language: 'français',
//   accountRegistration: 0,
//   passwordHash: 'helloWorld*',
//   verificationHash: '',
//   isVerified: true,
//   firstLogin: 1,
//   villageId: 1,
//   countryCode: 'FR',
//   positionLat: '48.8588443',
//   positionLon: '2.3469112',
//   hasStudentLinked: false,
//   type: 3,
// };
