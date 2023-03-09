import { axiosLoggedRequest } from './axiosRequest';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

/*  *
 * Get classroom as familly
 */

const getClassroomAsFamily = async (user: User) => {
  if (!user) return;
  if (user.type !== UserType.FAMILY) return;
  const response = await axiosLoggedRequest({
    method: 'GET',
    url: `/users/get-classroom/${user.id}`,
  });
  if (response.error) return null;
  if (response.data === null) return null;
  return response.data;
};

export default getClassroomAsFamily;
