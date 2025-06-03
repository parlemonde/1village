import { Classroom } from '../../entities/classroom';
import { AppDataSource } from '../../utils/data-source';

type GetClassroomsParams = {
  countryCode?: string;
  villageId?: number;
  classroomId?: number;
};

const classroomRepository = AppDataSource.getRepository(Classroom);

export const getClassrooms = async ({ countryCode, villageId, classroomId }: GetClassroomsParams) => {
  const classroomQB = classroomRepository
    .createQueryBuilder('classroom')
    .select(['classroom.id', 'classroom.villageId', 'classroom.name', 'classroom.countryCode']);

  if (countryCode) {
    classroomQB.where('classroom.countryCode = :countryCode', { countryCode });
  }

  if (classroomId) {
    classroomQB.andWhere('classroom.id = :classroomId', { classroomId });
  }

  if (villageId) {
    classroomQB.andWhere('classroom.villageId = :villageId', { villageId });
  }

  return await classroomQB
    .setFindOptions({
      relations: {
        user: true,
      },
    })
    .getMany();
};
