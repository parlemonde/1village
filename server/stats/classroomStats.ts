import { UserType } from '../../types/user.type';
import { Activity } from '../entities/activity';
import { Classroom } from '../entities/classroom';
import { Student } from '../entities/student';
import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';
import { getPhasePeriod, phaseWasSelected } from './villageStats';

const classroomRepository = AppDataSource.getRepository(Classroom);
const studentRepository = AppDataSource.getRepository(Student);
const villageRepository = AppDataSource.getRepository(Village);

const teacherType = UserType.TEACHER;

export const getClassroomsInfos = async () => {
  return await classroomRepository
    .createQueryBuilder('classroom')
    .innerJoin('classroom.village', 'village')
    .innerJoin('classroom.user', 'user')
    .select([
      'classroom.id AS classroomId',
      'classroom.name AS classroomName',
      'classroom.countryCode AS classroomCountryCode',
      'village.id AS villageId',
      'village.name AS villageName',
      'user.id AS userId',
      'user.firstname AS userFirstname',
      'user.lastname AS userLastname',
    ])
    .addSelect((subQuery) => {
      return subQuery
        .select(['COUNT(activity.id) AS count', 'activity.phase AS phase', 'activity.type AS type'])
        .from(Activity, 'activity')
        .where('activity.userId = user.id')
        .groupBy('activity.phase, activity.type');
    }, 'userActivities')
    .where('user.type = :teacherType', { teacherType })
    .getRawMany();
};

export const getRegisteredClassroomsCount = async () => {
  const result = await classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(DISTINCT(classroom.id))', 'classroomsCount')
    .innerJoin('classroom.user', 'user')
    .where('user.type = :teacherType', { teacherType })
    .getRawOne();

  return parseInt(result.classroomsCount);
};

export const getConnectedClassroomsCount = async () => {
  const result = await classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(DISTINCT(classroom.id))', 'classroomsCount')
    .innerJoin('classroom.user', 'user')
    .where('user.type = :teacherType', { teacherType })
    .andWhere('user.accountRegistration = :accountRegistration', { accountRegistration: 10 })
    .getRawOne();

  return parseInt(result.classroomsCount);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getContributedClassroomsCount = async (phase: number | null) => {
  // TO DEBUG
  // const activitySubQuery = AppDataSource.createQueryBuilder()
  //   .select('activity.userId AS userId')
  //   .from(Activity, 'activity')
  //   .innerJoin('activity.user', 'user') // Ensure we join user
  //   .where('user.type = :teacherType', { teacherType })
  //   .groupBy('activity.userId')
  //   .having(phase ? 'COUNT(DISTINCT activity.phase) = :phase' : 'COUNT(DISTINCT activity.phase) = :nbPhases', phase ? { phase } : { nbPhases: 3 })
  //   .getQuery();
  // const commentSubQuery = AppDataSource.createQueryBuilder()
  //   .select('comment.userId AS userId')
  //   .from(Comment, 'comment')
  //   .innerJoin('comment.user', 'user') // Ensure we join user
  //   .where('user.type = :teacherType', { teacherType })
  //   .getQuery();
  // const videoSubQuery = AppDataSource.createQueryBuilder()
  //   .select('video.userId AS userId')
  //   .from(Video, 'video')
  //   .innerJoin('video.user', 'user') // Ensure we join user
  //   .where('user.type = :teacherType', { teacherType })
  //   .getQuery();
  // const result = await AppDataSource.createQueryBuilder()
  //   .select('COUNT(DISTINCT userId)', 'contributedUsersCount')
  //   .from(`(${activitySubQuery} INTERSECT ${commentSubQuery} INTERSECT ${videoSubQuery})`, 'subquery')
  //   .getRawOne();
  // return parseInt(result.contributedUsersCount);
  return 10;
};

export const getChildrenCodesCount = async (classroomId?: number, phase?: number) => {
  const classroom = await classroomRepository
    .createQueryBuilder('classroom')
    .innerJoin('classroom.village', 'village')
    .where('classroom.id = :classroomId', { classroomId })
    .getOne();
  const villageId = classroom?.villageId;
  const query = studentRepository.createQueryBuilder('student').innerJoin('student.classroom', 'classroom').innerJoin('classroom.village', 'village');
  if (classroomId) {
    query.andWhere('classroom.id = :classroomId', { classroomId });
    if (phaseWasSelected(phase) && villageId) {
      const village = await villageRepository.findOne({ where: { id: villageId } });
      const phaseValue = phase as number;
      const { debut, end } = await getPhasePeriod(villageId, phaseValue);
      query.andWhere('student.createdAt >= :debut', { debut });
      if (phaseValue != village?.activePhase) query.andWhere('student.createdAt <= :end', { end });
    }
  }
  const childrenCodeCount = await query.getCount();
  return childrenCodeCount;
};

export const getConnectedFamiliesCount = async (classroomId?: number, phase?: number) => {
  const classroom = await classroomRepository
    .createQueryBuilder('classroom')
    .innerJoin('classroom.village', 'village')
    .where('classroom.id = :classroomId', { classroomId })
    .getOne();
  const villageId = classroom?.villageId;
  const village = await villageRepository.findOne({ where: { id: villageId } });
  const query = studentRepository
    .createQueryBuilder('student')
    .innerJoin('classroom', 'classroom', 'classroom.id = student.classroomId')
    .andWhere('classroom.id = :classroomId', { classroomId })
    .andWhere('student.numLinkedAccount >= 1');
  if (villageId) {
    query.andWhere('classroom.villageId = :villageId', { villageId });
    if (phaseWasSelected(phase)) {
      const phaseValue = phase as number;
      const { debut, end } = await getPhasePeriod(villageId, phaseValue);
      query.andWhere('student.createdAt >= :debut', { debut });
      if (phaseValue != village?.activePhase) query.andWhere('student.createdAt <= :end', { end });
    }
  }

  const connectedFamiliesCount = await query.getCount();

  return connectedFamiliesCount;
};

export const getFamiliesWithoutAccount = async (classroomId?: number) => {
  const query = studentRepository
    .createQueryBuilder('student')
    .innerJoin('student.classroom', 'classroom')
    .innerJoin('classroom.user', 'user')
    .innerJoin('user.village', 'village')
    .where('student.numLinkedAccount < 1');
  if (classroomId) query.andWhere('classroom.id = :classroomId', { classroomId });

  query.select([
    'classroom.name AS classroom_name',
    'classroom.countryCode as classroom_country',
    'student.firstname AS student_firstname',
    'student.lastname AS student_lastname',
    'student.id AS student_id',
    'student.createdAt as student_creation_date',
    'village.name AS village_name',
  ]);

  const familiesWithoutAccount = query.getRawMany();
  return familiesWithoutAccount;
};
