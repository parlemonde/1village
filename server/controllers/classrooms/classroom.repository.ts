import { Classroom } from '../../entities/classroom';
import { AppDataSource } from '../../utils/data-source';

interface GetClassroomsParams {
  countryCode?: string;
  villageId?: number;
  classroomId?: number;
}

interface ClassroomFilters {
  id?: number;
  countryCode?: string;
  villageId?: number;
}

const classroomRepository = AppDataSource.getRepository(Classroom);

export const getClassrooms = async ({ countryCode, villageId, classroomId }: GetClassroomsParams) => {
  const classroomFilters: ClassroomFilters = { id: classroomId, countryCode, villageId };

  return await classroomRepository.find({
    relations: {
      user: true,
    },
    where: classroomFilters,
  });
};

export async function getClassroomById(id: number): Promise<Classroom | null> {
  return await classroomRepository.findOne({
    relations: {
      user: true,
    },
    where: { id },
  });
}
