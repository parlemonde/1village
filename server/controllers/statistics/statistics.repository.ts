import { ActivityStatus } from '../../../types/activity.type';
import type { Activity } from '../../entities/activity';
import type { Classroom } from '../../entities/classroom';
import { getActivities } from '../activities/activities.repository';
import { getClassrooms } from '../classrooms/classroom.repository';
import { getCommentCountForActivities } from '../comments/comments.repository';
import { getVillages } from '../villages/village.repository';

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

type PhaseCounts = {
  mascotCount?: number;
  videoCount?: number;
  challengeCount?: number;
  enigmaCount?: number;
  gameCount?: number;
  questionCount?: number;
  reportingCount?: number;
  storyCount?: number;
  anthemCount?: number;
  reinventStoryCount?: number;
  contentLibreCount?: number;
  reactionCount?: number;
};

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
    const phaseCounts = phase as PhaseCounts;
    return (
      total +
      (phaseCounts.mascotCount || 0) +
      (phaseCounts.videoCount || 0) +
      (phaseCounts.challengeCount || 0) +
      (phaseCounts.enigmaCount || 0) +
      (phaseCounts.gameCount || 0) +
      (phaseCounts.questionCount || 0) +
      (phaseCounts.reportingCount || 0) +
      (phaseCounts.storyCount || 0) +
      (phaseCounts.anthemCount || 0) +
      (phaseCounts.reinventStoryCount || 0) +
      (phaseCounts.contentLibreCount || 0)
    );
  }, 0);
};

const createClassroomEntry = (classroom: Classroom, countryCode: string, phaseDetails: unknown[], format: 'dashboard' | 'compare'): ClassroomData => {
  const classroomName = classroom.user?.displayName || classroom.name || `Classe ${classroom.id}`;

  if (format === 'dashboard') {
    const totalPublications = calculateTotalPublications(phaseDetails);
    return {
      name: classroomName,
      classroomId: classroom.id.toString(),
      totalPublications,
      classroomName,
      countryCode,
      phaseDetails,
    };
  }

  return {
    name: classroomName,
    phaseDetails,
    classroomName,
    classroomId: classroom.id,
    countryCode,
  };
};

const createCountryEntry = (countryCode: string, phaseDetails: unknown[], format: 'dashboard' | 'compare'): ClassroomData => {
  if (format === 'dashboard') {
    const totalPublications = calculateTotalPublications(phaseDetails);
    return {
      name: `${countryCode} Classes`,
      classroomId: null,
      totalPublications,
      classroomName: `${countryCode} Classes`,
      countryCode,
      phaseDetails,
    };
  }

  return {
    name: `${countryCode} Classes`,
    phaseDetails,
    classroomName: `${countryCode} Classes`,
    classroomId: null,
    countryCode,
  };
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
    const phaseDetails: unknown[] = [];

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
      for (const classroom of countryClassrooms as Classroom[]) {
        const classroomEntry = createClassroomEntry(classroom, countryCode, phaseDetails, format);
        classroomDetails.push(classroomEntry);
      }
    } else {
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
    const specificClassroom = await getClassrooms({ classroomId });
    if (specificClassroom.length > 0) {
      const villageIdOfClassroom = specificClassroom[0].villageId;
      classrooms = await getClassrooms({ countryCode: undefined, villageId: villageIdOfClassroom });
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

  const videoCount = activities.reduce(
    (count, activity) => count + (Array.isArray(activity.content) ? activity.content.filter((content) => content.type === 'video').length : 0),
    0,
  );
  const commentCount = await getCommentCountForActivities(activities.map((activity) => activity.id));

  const baseActivityCount = { phaseId, draftCount, videoCount, commentCount };

  const activityByType = groupBy(activities, (activity: Activity) => activity.type);

  if (phaseId === 1) {
    const mascotCount = activityByType.get(8)?.length || 0;
    const indiceCount = activityByType.get(6)?.length || 0;
    const enigmaCount = activityByType.get(1)?.length || 0;
    const challengeCount = activityByType.get(2)?.length || 0;
    const questionCount = activityByType.get(3)?.length || 0;
    const gameCount = activityByType.get(4)?.length || 0;
    const contentLibreCount = activityByType.get(5)?.length || 0;

    return {
      ...baseActivityCount,
      indiceCount,
      mascotCount,
      enigmaCount,
      challengeCount,
      questionCount,
      gameCount,
      contentLibreCount,
    };
  } else if (phaseId === 2) {
    const reportingCount = activityByType.get(9)?.length || 0;
    const challengeCount = activityByType.get(2)?.length || 0;
    const enigmaCount = activityByType.get(1)?.length || 0;
    const gameCount = activityByType.get(4)?.length || 0;
    const questionCount = activityByType.get(3)?.length || 0;
    const reactionCount = activityByType.get(10)?.length || 0;
    const storyCount = activityByType.get(13)?.length || 0;

    return {
      ...baseActivityCount,
      reportingCount,
      challengeCount,
      enigmaCount,
      gameCount,
      questionCount,
      reactionCount,
      storyCount,
    };
  } else if (phaseId === 3) {
    const reinventStoryCount = activityByType.get(14)?.length || 0;
    const anthemCount = (activityByType.get(11)?.length || 0) + (activityByType.get(12)?.length || 0);

    return {
      ...baseActivityCount,
      reinventStoryCount,
      anthemCount,
    };
  } else {
    return { ...baseActivityCount };
  }
};
