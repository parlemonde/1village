import { axiosRequest } from 'src/utils/axiosRequest';
import type { Student } from 'types/student.type';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

export const getUser = async (userId: number) => {
  const response = await axiosRequest({
    method: 'GET',
    url: `/users/${userId}`,
  });
  if (response.error) {
    return [];
  }
  return response.data;
};

export const getLinkedStudentsToUser = async (userId: number) => {
  try {
    const response = await axiosRequest({
      method: 'GET',
      url: `/users/${userId}/linked-students`,
    });
    return response.data as Student[];
  } catch (error) {
    console.error('Error fetching linked students:', error);
    return [];
  }
};

export const getUserVisibilityFamilyParams = async (user: User) => {
  if (user.type === UserType.FAMILY || user.type === UserType.TEACHER) {
    const response = await axiosRequest({
      method: 'GET',
      url: `/users/${user.id}/visibility-params`,
    });
    if (response.error) return null;
    return response.data;
  }
  return [];
};
