import { axiosRequest } from 'src/utils/axiosRequest';
import type { Student } from 'types/student.type';

export const editStudent = async (updatedStudent: Promise<Partial<Student>>) => {
    const { id, ...rest } = await updatedStudent;

    const response = await axiosRequest({
        method: 'PUT',
        url: `/students/${id}`,
        data: { ...rest },
    });

    if (response.error) {
        throw response.error;
    }
    return response.data;
};
