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
