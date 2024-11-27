import { PhaseHistory } from '../entities/phaseHistory';
import { Student } from '../entities/student';
import { User } from '../entities/user';
import { Village, VillagePhase } from '../entities/village';
import { AppDataSource } from '../utils/data-source';

const userRepository = AppDataSource.getRepository(User);
const studentRepository = AppDataSource.getRepository(Student);
const phaseHistoryRepository = AppDataSource.getRepository(PhaseHistory);
const villageRepository = AppDataSource.getRepository(Village);

export const getPhasePeriod = async (villageId: number, phase: number): Promise<{ debut: Date | undefined; end: Date | undefined }> => {
  // Getting the debut and end dates for the given phase
  const query = phaseHistoryRepository
    .createQueryBuilder('phaseHistory')
    .withDeleted()
    .where('phaseHistory.villageId = :villageId', { villageId })
    .andWhere('phaseHistory.phase = :phase', { phase });
  query.select(['phaseHistory.startingOn', 'phaseHistory.endingOn']);
  const result = await query.getOne();
  const debut = result?.startingOn;
  const end = result?.endingOn;
  return {
    debut,
    end,
  };
};

export const phaseWasSelected = (phase: number | undefined): boolean => {
  return phase !== undefined && Object.values(VillagePhase).includes(+phase);
};
export const getChildrenCodesCount = async (villageId?: number, phase?: number) => {
  const query = studentRepository.createQueryBuilder('student').innerJoin('student.classroom', 'classroom').innerJoin('classroom.village', 'village');
  const village = await villageRepository.findOne({ where: { id: villageId } });
  if (villageId) {
    query.andWhere('classroom.villageId = :villageId', { villageId });
    if (phaseWasSelected(phase)) {
      const phaseValue = phase as number;
      const { debut, end } = await getPhasePeriod(villageId, phaseValue);
      query.andWhere('student.createdAt >= :debut', { debut });
      if (phaseValue != village?.activePhase) query.andWhere('student.createdAt <= :end', { end });
    }
  }
  const childrenCodeCount = await query.getCount();
  return childrenCodeCount;
};

export const getFamilyAccountsCount = async (villageId?: number, phase?: number) => {
  const village = await villageRepository.findOne({ where: { id: villageId } });
  const query = userRepository
    .createQueryBuilder('user')
    .innerJoin('user.village', 'village')
    .innerJoin('classroom', 'classroom', 'classroom.villageId = village.id')
    .innerJoin('student', 'student', 'student.classroomId = classroom.id');

  if (villageId) {
    query.andWhere('classroom.villageId = :villageId', { villageId });
    if (phaseWasSelected(phase)) {
      const phaseValue = phase as number;
      const { debut, end } = await getPhasePeriod(villageId, phaseValue);
      query.andWhere('user.createdAt >= :debut', { debut });
      if (phaseValue != village?.activePhase) query.andWhere('student.createdAt <= :end', { end });
    }
  }

  query.groupBy('user.id');
  const familyAccountsCount = await query.getCount();
  return familyAccountsCount;
};

export const getConnectedFamiliesCount = async (villageId?: number, phase?: number) => {
  const village = await villageRepository.findOne({ where: { id: villageId } });
  const query = studentRepository
    .createQueryBuilder('student')
    .innerJoin('classroom', 'classroom', 'classroom.id = student.classroomId')
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

export const getFamiliesWithoutAccount = async (villageId?: number) => {
  const query = studentRepository
    .createQueryBuilder('student')
    .innerJoin('student.classroom', 'classroom')
    .innerJoin('classroom.user', 'user')
    .innerJoin('user.village', 'village')
    .where('student.numLinkedAccount < 1');
  if (villageId) query.andWhere('classroom.villageId = :villageId', { villageId });

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

export const getFloatingAccounts = async (villageId?: number) => {
  const query = userRepository.createQueryBuilder('user').where('user.hasStudentLinked = 0').andWhere('user.type = 4');

  if (villageId) query.andWhere('user.villageId = :villageId', { villageId });

  query.select(['user.id', 'user.firstname', 'user.lastname', 'user.language', 'user.email', 'user.createdAt']);
  const floatingAccounts = query.getMany();
  return floatingAccounts;
};
