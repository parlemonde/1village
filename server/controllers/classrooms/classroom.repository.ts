import { Classroom } from '../../entities/classroom';
import { AppDataSource } from '../../utils/data-source';

type GetClassroomsParams = {
  countryCode?: string;
  villageId?: number;
  classroomId?: number;
};

const classroomRepository = AppDataSource.getRepository(Classroom);

export const getClassrooms = async ({ countryCode, villageId, classroomId }: GetClassroomsParams) => {
  const classroomFilters: any = {};

  if (classroomId) {
    classroomFilters.id = classroomId;
  }
  if (countryCode) {
    classroomFilters.countryCode = countryCode;
  }
  if (villageId) {
    classroomFilters.villageId = villageId;
  }

  return await classroomRepository.find({
    relations: {
      user: true,
    },
    where: classroomFilters,
  });
};
