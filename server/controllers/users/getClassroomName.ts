import { User } from '../../entities/user';
import { AppDataSource } from '../../utils/data-source';

const userRepository = AppDataSource.getRepository(User);

export default async function getClassroomName(userId: number) {
  return (await userRepository.findOneBy({ id: userId }))?.school;
}
