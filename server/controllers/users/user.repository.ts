import { User } from '../../entities/user';
import { AppDataSource } from '../../utils/data-source';

const userRepository = AppDataSource.getRepository(User);

// Type for user updates that excludes complex relations
type UserUpdateData = Pick<
  User,
  | 'pseudo'
  | 'firstname'
  | 'lastname'
  | 'level'
  | 'school'
  | 'city'
  | 'postalCode'
  | 'address'
  | 'avatar'
  | 'displayName'
  | 'hasAcceptedNewsletter'
  | 'language'
  | 'accountRegistration'
  | 'passwordHash'
  | 'verificationHash'
  | 'isVerified'
  | 'firstLogin'
  | 'type'
  | 'villageId'
  | 'countryCode'
  | 'positionLat'
  | 'positionLon'
  | 'hasStudentLinked'
>;

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

export const updateUser = async (userId: number, updateData: Partial<UserUpdateData>): Promise<User | null> => {
  await userRepository.update(userId, updateData);
  return await getUserById(userId);
};
