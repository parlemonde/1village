import type { User } from 'server/entities/user';

import { axiosRequest } from 'src/utils/axiosRequest';

export const updateUser = async (id: number, userData: Partial<User>) => {
    const response = await axiosRequest({
        method: 'PUT',
        url: `/users/${id}`,
        data: userData,
    });

    if (response.error) {
        throw new Error('There was an error updating the user');
    }

    return response.data;
};
