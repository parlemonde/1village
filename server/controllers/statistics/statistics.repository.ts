import { ActivityStatus, ActivityType } from '../../../types/activity.type';
import type { Activity } from '../../entities/activity';
import type { Classroom } from '../../entities/classroom';
import { getActivities } from '../activities/activities.repository';
import { getClassrooms } from '../classrooms/classroom.repository';
import { getCommentCountForActivities } from '../comments/comments.repository';
import { getVillages } from '../villages/village.repository';

// DEPRECATED: groupBy function only available for Node.js v21
const groupBy = (list: any, keyGetter: any) => {
  const map = new Map();

  list.forEach((item: any) => {
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
  countryCode?: string;
  villageId?: number;
  classroomId?: number;
};

export const getActivityTypeCountByVillages = async (params?: GetActivityTypeCountByVillagesParams) => {
  const { phase, countryCode, villageId, classroomId } = params || {};

  const classrooms = await getClassrooms({ countryCode, villageId, classroomId });
  const classroomIds = classrooms.map((classroom: Classroom) => classroom.id);

  const villageIds = [...new Set(classrooms.map((classroom) => classroom.villageId))];
  const villages = await getVillages({ villageIds });
  const activities = await getActivities({ phase, classroomIds });

  const activitiesByPhase = groupBy(activities, (activity: Activity) => activity.phase);

  const result = [];

  for (const village of villages) {
    const filteredClassrooms = classrooms.filter((classroom) => classroom.villageId === village.id);

    const classroomDetails: any[] = [];

    for (const filteredClassroom of filteredClassrooms) {
      const phaseDetails: any[] = [];

      for (const [phaseId, activities] of activitiesByPhase) {
        if (Number(phaseId) === Number(phase) || phase === undefined) {
          const filteredActivities = activities.filter((activity: Activity) => {
            return filteredClassroom.user.id === activity.user?.id && activity.phase === phaseId;
          });

          const activityCounts = await getActivityCounts(filteredActivities, phaseId);
          phaseDetails.push(activityCounts);
        }
      }

      classroomDetails.push({ phaseDetails, name: filteredClassroom.name, countryCode: filteredClassroom.countryCode });
    }

    result.push({
      villageName: village.name,
      classrooms: classroomDetails,
    });
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
    const mascotCount = activityByType.get(ActivityType.MASCOTTE)?.length;
    const indiceCount = activityByType.get(ActivityType.INDICE)?.length;

    return {
      ...baseActivityCount,
      ...(indiceCount && { indiceCount }),
      ...(mascotCount && { mascotCount }),
    };
  } else if (phaseId === 2) {
    const reportingCount = activityByType.get(ActivityType.REPORTAGE)?.length;
    const challengeCount = activityByType.get(ActivityType.DEFI)?.length;
    const enigmaCount = activityByType.get(ActivityType.ENIGME)?.length;
    const gameCount = activityByType.get(ActivityType.GAME)?.length;
    const questionCount = activityByType.get(ActivityType.QUESTION)?.length;
    const reactionCount = activityByType.get(ActivityType.REACTION)?.length;
    const storyCount = activityByType.get(ActivityType.STORY)?.length;

    return {
      ...baseActivityCount,
      ...(reportingCount && { reportingCount }),
      ...(challengeCount && { challengeCount }),
      ...(enigmaCount && { enigmaCount }),
      ...(gameCount && { gameCount }),
      ...(questionCount && { questionCount }),
      ...(reactionCount && { reactionCount }),
      ...(storyCount && { storyCount }),
    };
  } else if (phaseId === 3) {
    const reinventStoryCount = activityByType.get(ActivityType.RE_INVENT_STORY)?.length;
    const anthemCount = activityByType.get(ActivityType.ANTHEM)?.length;

    return {
      ...baseActivityCount,
      ...(reinventStoryCount && { reinventStoryCount }),
      ...(anthemCount && { anthemCount }),
    };
  } else {
    return { ...baseActivityCount };
  }
};
