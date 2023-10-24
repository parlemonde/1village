import { axiosRequest } from 'src/utils/axiosRequest';

export const getUsersLinkedToStudent = async (id: number) => {
  const response = await axiosRequest({
    method: 'GET',
    url: `/students/${id}/get-users-linked`,
  });

  if (response.error) {
    throw response.error;
  }
  return response.data;
};

export const getClassroomOfStudent = async (id: number) => {
  const response = await axiosRequest({
    method: 'GET',
    url: `/students/${id}/classroom`,
  });
  if (response.error) {
    throw response.error;
  }
  return response.data;
};

export const getStudentsAndUsers = async (classroomId: number) => {
  const response = await axiosRequest({
    method: 'GET',
    url: `/students/${classroomId}/get-students-and-users`,
  });

  if (response.error) {
    throw response.error;
  }
  return response.data;
};
