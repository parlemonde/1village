import { axiosRequest } from 'src/utils/axiosRequest';

export const deleteUserStudentRelation = async (studentId: number, userId: number) => {
  const response = await axiosRequest({
    method: 'DELETE',
    url: `/students/${studentId}/delete-user-link/${userId}`,
  });

  if (response.error) {
    throw response.error;
  }

  return response.data;
};