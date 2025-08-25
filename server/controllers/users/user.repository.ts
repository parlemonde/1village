import { User } from '../../entities/user';
import { AppDataSource } from '../../utils/data-source';

const userRepository = AppDataSource.getRepository(User);

export const getUserById = async (userId: number): Promise<User | null> => {
  return await userRepository.findOneBy({ id: userId });
};

export const getClassroomName = async (userId: number): Promise<string | undefined> => {
  const user = await getUserById(userId);
  return user?.school;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await userRepository.findOneBy({ email });
};

export const updateUser = async (userId: number, updateData: Partial<User>): Promise<User | null> => {
  await userRepository.update(userId, updateData);
  return await getUserById(userId);
};
