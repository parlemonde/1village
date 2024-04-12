import { Activity } from '../entities/activity';
import { Classroom } from '../entities/classroom';
import { Student } from '../entities/student';
import { UserType } from '../entities/user';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

export const statisticsController = new Controller('/statistics');

const classroomRepository = AppDataSource.getRepository(Classroom);
const activityRepository = AppDataSource.getRepository(Activity);
const studentRepository = AppDataSource.getRepository(Student);

statisticsController.get({ path: '/contributions' }, async (_req, res) => {
  res.sendJSON(
    await classroomRepository.count({
      relations: {
        user: {
          activities: true,
        },
      },
      where: {
        user: {
          id: UserType.TEACHER,
        },
      },
    }),
  );
});

statisticsController.get({ path: '/student-accounts' }, async (_req, res) => {
  res.sendJSON(
    await studentRepository
      .createQueryBuilder('student')
      .select('COUNT(*)', 'totalStudentAccounts')
      .addSelect('COUNT(DISTINCT student.classroomId)', 'classWithStudentAccounts')
      .addSelect('COUNT(DISTINCT userToStudent.userId)', 'connectedFamilies')
      .leftJoin('user_to_student', 'userToStudent', 'userToStudent.studentId = student.id')
      .getRawOne(),
  );
});

statisticsController.get({ path: '/test' }, async (_req, res) => {
  res.sendJSON(
    await classroomRepository.count({
      relations: {
        user: {
          activities: true,
        },
      },
      where: {
        user: {
          id: UserType.TEACHER,
        },
      },
    }),
  );
});
