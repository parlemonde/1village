import { ActivityStatus } from '../../../types/activity.type';
import type { PhaseDetails } from '../../../types/statistics.type';
import type { Activity } from '../../entities/activity';
import type { Classroom } from '../../entities/classroom';
import type { Village } from '../../entities/village';
import { getActivities, getActivitiesByClassroomUserAndPhase, getActivitiesByVillageCountryAndPhase } from '../activities/activities.repository';
import { getClassrooms } from '../classrooms/classroom.repository';
import { getCommentCountForActivities, getCommentsCountByVillageCountryAndPhase, getUserCommentsCountByPhase } from '../comments/comments.repository';
import { getVillageById, getVillages } from '../villages/village.repository';

const groupBy = <T>(list: T[], keyGetter: (item: T) => string | number) => {
  const map = new Map();

  list.forEach((item: T) => {
    const key = keyGetter(item);
    const collection = map.get(key);

    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });

  return map;
};

type GetActivityTypeCountByVillagesParams = {
  phase?: number;
  villageId?: number;
  classroomId?: number;
  format?: 'dashboard' | 'compare';
};

type PhaseActivityCounts = Omit<PhaseDetails, 'phaseId' | 'commentCount' | 'draftCount'>;

type ClassroomData = {
  name: string;
  classroomId: string | number | null;
  totalPublications?: number;
  classroomName: string;
  countryCode: string;
  phaseDetails: unknown[];
};

const calculateTotalPublications = (phaseDetails: unknown[]): number => {
  return phaseDetails.reduce((total: number, phase: unknown) => {
    const phaseCounts = phase as PhaseActivityCounts;

    const countKeys = [
      'mascotCount',
      'videoCount',
      'challengeCount',
      'enigmaCount',
      'gameCount',
      'questionCount',
      'reportingCount',
      'storyCount',
      'anthemCount',
      'reinventStoryCount',
      'contentLibreCount',
    ];
    return total + countKeys.reduce((sum, key) => sum + ((phaseCounts[key as keyof typeof phase] as number) || 0), 0);
  }, 0);
};

const createClassroomEntry = (
  classroom: Classroom,
  countryCode: string,
  phaseDetails: PhaseDetail[],
  format: 'dashboard' | 'compare',
): ClassroomData => {
  const classroomName = getClassroomDisplayName(classroom);

  const classroomEntry: ClassroomData = {
    name: classroomName,
    classroomName,
    countryCode,
    classroomId: classroom.id,
    phaseDetails,
  };

  if (format === 'dashboard') {
    classroomEntry.totalPublications = calculateTotalPublications(phaseDetails);
  }

  return classroomEntry;
};

function getClassroomDisplayName(classroom: Classroom): string {
  const classroomUser = classroom.user;
  const nameWithUserLevelAndCity = classroomUser.level && classroomUser.city ? `La classe de ${classroomUser.level} à ${classroomUser.city}` : '';
  const nameWithUserCity = classroomUser.city ? `La classe de ${classroomUser.city}` : '';
  return classroom.name ?? classroomUser.displayName ?? nameWithUserLevelAndCity ?? nameWithUserCity ?? `Classe n°${classroom.id}`;
}

const createCountryEntry = (countryCode: string, phaseDetails: unknown[], format: 'dashboard' | 'compare'): ClassroomData => {
  const countryEntry: ClassroomData = {
    name: `${countryCode} Classes`,
    classroomName: `${countryCode} Classes`,
    countryCode,
    classroomId: null,
    phaseDetails,
  };

  if (format === 'dashboard') {
    countryEntry.totalPublications = calculateTotalPublications(phaseDetails);
  }

  return countryEntry;
};

const processClassroomsForVillage = async (
  village: { id: number; name: string },
  classrooms: Classroom[],
  activitiesByPhase: Map<string | number, Activity[]>,
  phase: number | undefined,
  classroomId: number | undefined,
  format: 'dashboard' | 'compare',
) => {
  const villageClassrooms = classrooms.filter((classroom: Classroom) => classroom.villageId === village.id);
  const classroomsByCountry = groupBy(villageClassrooms, (classroom: Classroom) => classroom.countryCode);

  const classroomDetails: ClassroomData[] = [];

  for (const [countryCode, countryClassrooms] of classroomsByCountry) {
    const phaseDetails: PhaseDetail[] = [];

    for (const [phaseId, phaseActivities] of activitiesByPhase) {
      if (Number(phaseId) === Number(phase) || phase === undefined) {
        const filteredActivities = phaseActivities.filter((activity: Activity) => {
          const userCountryCode = (activity as unknown as { user?: { countryCode: string } }).user?.countryCode;
          return userCountryCode === countryCode && activity.phase === Number(phaseId);
        });

        const activityCounts = await getActivityCounts(filteredActivities, Number(phaseId));
        phaseDetails.push(activityCounts);
      }
    }

    if (classroomId) {
      // On veut une liste de classes
      for (const classroom of countryClassrooms as Classroom[]) {
        const classroomEntry = createClassroomEntry(classroom, countryCode, phaseDetails, format);
        classroomDetails.push(classroomEntry);
      }
    } else {
      // On veut une liste de pays
      const countryEntry = createCountryEntry(countryCode, phaseDetails, format);
      classroomDetails.push(countryEntry);
    }
  }

  return {
    villageName: village.name,
    classrooms: classroomDetails,
  };
};

export const getActivityTypeCountByVillages = async (params?: GetActivityTypeCountByVillagesParams) => {
  const { phase, villageId, classroomId, format = 'compare' } = params || {};

  let classrooms: Classroom[];
  if (classroomId) {
    const classroomWithSpecificId = await getClassrooms({ classroomId });
    if (classroomWithSpecificId.length > 0) {
      const classroomVillageId = classroomWithSpecificId[0].villageId;
      classrooms = await getClassrooms({ countryCode: undefined, villageId: classroomVillageId });
    } else {
      classrooms = [];
    }
  } else {
    classrooms = await getClassrooms({ countryCode: undefined, villageId, classroomId });
  }

  const villageIds = [...new Set(classrooms.map((classroom: Classroom) => classroom.villageId))] as number[];
  const villages = await getVillages({ villageIds });
  const activities = await getActivities({ phase, villageIds });
  const activitiesByPhase = groupBy(activities, (activity: Activity) => activity.phase);

  const result = [];
  for (const village of villages) {
    const villageData = await processClassroomsForVillage(village, classrooms, activitiesByPhase, phase, classroomId, format);
    result.push(villageData);
  }

  return result;
};

const getActivityCounts = async (activities: Activity[], phaseId: number) => {
  const draftCount = activities.filter((activity: Activity) => activity.status === ActivityStatus.DRAFT).length;

  // Control if activity content is an array because of bad data in a staging database...
  const videoCount = activities.reduce(
    (count, activity) => count + (Array.isArray(activity.content) ? activity.content.filter((content) => content.type === 'video').length : 0),
    0,
  );
  const commentCount = await getCommentCountForActivities(activities.map((activity) => activity.id));

  const baseActivityCount = { phaseId, draftCount, videoCount, commentCount };

  const activityByType = groupBy(activities, (activity: Activity) => activity.type);

  if (phaseId === 1) {
    const indiceCount = activityByType.get(6)?.length || 0;
    const mascotCount = activityByType.get(8)?.length || 0;
    const enigmaCount = activityByType.get(1)?.length || 0;
    const challengeCount = activityByType.get(2)?.length || 0; // Challenge = Defi
    const questionCount = activityByType.get(3)?.length || 0;
    const gameCount = activityByType.get(4)?.length || 0;

    return {
      ...baseActivityCount,
      indiceCount,
      mascotCount,
      enigmaCount,
      challengeCount,
      questionCount,
      gameCount,
    };
  } else if (phaseId === 2) {
    const reportingCount = activityByType.get(9)?.length || 0;
    const challengeCount = activityByType.get(2)?.length || 0; // Challenge = Defi
    const enigmaCount = activityByType.get(1)?.length || 0;
    const gameCount = activityByType.get(4)?.length || 0;
    const questionCount = activityByType.get(3)?.length || 0;
    const reactionCount = activityByType.get(10)?.length || 0;

    return {
      ...baseActivityCount,
      reportingCount,
      challengeCount,
      enigmaCount,
      gameCount,
      questionCount,
      reactionCount,
    };
  } else if (phaseId === 3) {
    const reinventStoryCount = activityByType.get(14)?.length || 0;
    const anthemCount = (activityByType.get(11)?.length || 0) + (activityByType.get(12)?.length || 0);
    const contentLibreCount = activityByType.get(5)?.length || 0;
    const storyCount = activityByType.get(13)?.length || 0;

    return {
      ...baseActivityCount,
      reinventStoryCount,
      anthemCount,
      contentLibreCount,
      storyCount,
    };
  } else {
    return { ...baseActivityCount };
  }
};

export async function getDetailedActivitiesCountsByVillage(villageId: number, phase: number) {
  const format = 'compare';

  const village: Village | null = await getVillageById(villageId);
  if (!village) {
    throw new Error(`Village with id ${villageId} not found`);
  }

  const villageCountryCodes = village.countryCodes;
  const villageCountriesDetails = await formatVillageActivitiesByPhase(villageId, phase, villageCountryCodes, format);

  return [{ villageName: village.name, classrooms: villageCountriesDetails }];
}

async function formatVillageActivitiesByPhase(
  villageId: number,
  phase: number,
  countryCodes: string[],
  format: 'dashboard' | 'compare',
): Promise<ClassroomData[]> {
  const countriesDetails: ClassroomData[] = [];

  for (const countryCode of countryCodes) {
    const activities = await getActivitiesByVillageCountryAndPhase(villageId, countryCode, phase);
    const activityCounts = await getActivityCounts(activities, phase);

    activityCounts.commentCount = await getCommentsCountByVillageCountryAndPhase(villageId, countryCode, phase);

    const countryEntry = createCountryEntry(countryCode, [activityCounts], format);
    countriesDetails.push(countryEntry);
  }

  return countriesDetails;
}

export async function getDetailedActivitiesCountsByClassrooms(villageId: number, phase: number) {
  const format = 'compare';

  const village: Village | null = await getVillageById(villageId);
  if (!village) {
    throw new Error(`Village with id ${villageId} not found`);
  }

  const classroomsOfTheSameVillage: Classroom[] = await getClassrooms({ villageId });
  const classroomsDetails = await formatClassroomsActivitiesByPhase(phase, classroomsOfTheSameVillage, format);

  return [{ villageName: village.name, classrooms: classroomsDetails }];
}

async function formatClassroomsActivitiesByPhase(phase: number, classrooms: Classroom[], format: 'dashboard' | 'compare'): Promise<ClassroomData[]> {
  const classroomDetails: ClassroomData[] = [];

  for (const classroom of classrooms) {
    const activities = await getActivitiesByClassroomUserAndPhase(classroom.user.id, phase);
    const activityCounts = await getActivityCounts(activities, phase);

    const phaseDetails: PhaseDetail = activityCounts;
    phaseDetails.commentCount = await getUserCommentsCountByPhase(classroom.user.id, phase);

    const classroomEntry = createClassroomEntry(classroom, classroom.countryCode, [phaseDetails], format);
    classroomDetails.push(classroomEntry);
  }

  return classroomDetails;
}
