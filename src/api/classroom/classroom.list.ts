import { useQuery } from 'react-query';
import { Classroom } from 'server/entities/classroom';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { User } from 'types/user.type';

type GetClassroomsResponse = Classroom[];

export const getClassrooms = async (): Promise<GetClassroomsResponse> => {
    const response = await axiosRequest<GetClassroomsResponse>({
        method: 'GET',
        url: `/classrooms`,
    });
    return response.error ? [] : response.data;
};

export function useClassrooms() {
    return useQuery(['classrooms'], () => getClassrooms());
}
