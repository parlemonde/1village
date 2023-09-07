import { axiosRequest } from 'src/utils/axiosRequest';
import type { Student } from 'types/student.type';

export const getUsers = async () => {
  const response = await axiosRequest({
    method: 'GET',
    url: '/users',
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

