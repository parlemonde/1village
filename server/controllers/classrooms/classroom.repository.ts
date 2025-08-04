import { Classroom } from '../../entities/classroom';
import { AppDataSource } from '../../utils/data-source';

type GetClassroomsParams = {
  countryCode?: string;
  villageId?: number;
  classroomId?: number;
};

const classroomRepository = AppDataSource.getRepository(Classroom);

export const getClassrooms = async ({ countryCode, villageId, classroomId }: GetClassroomsParams) => {
  // Try simple find first
  const allClassrooms = await classroomRepository.find({
    relations: {
      user: true,
    },
  });

  // Filter manually
  let filteredClassrooms = allClassrooms;

  if (classroomId) {
    filteredClassrooms = filteredClassrooms.filter((c: Classroom) => c.id === classroomId);
  }

  if (countryCode) {
    filteredClassrooms = filteredClassrooms.filter((c: Classroom) => c.countryCode === countryCode);
  }

  if (villageId) {
    filteredClassrooms = filteredClassrooms.filter((c: Classroom) => c.villageId === villageId);
  }

  return filteredClassrooms;
};
