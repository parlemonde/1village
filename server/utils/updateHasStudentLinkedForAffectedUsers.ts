import { User } from '../entities/user';
import { UserToStudent } from '../entities/userToStudent';
import { AppDataSource } from './data-source';

export default async function updateHasStudentLinkedForAffectedUsers(affectedUserIds: number[]) {
  const userRepository = AppDataSource.getRepository(User);
  const userToStudentRepository = AppDataSource.getRepository(UserToStudent);

  for (const userId of affectedUserIds) {
    const user = await userRepository.findOne({ where: { id: userId }, relations: ['userToStudents'] });

    if (user) {
      const userToStudents = await userToStudentRepository.find({
        where: { user: { id: user.id } },
      });

      user.hasStudentLinked = userToStudents.length > 0;
      await userRepository.save(user);
    }
  }
}
