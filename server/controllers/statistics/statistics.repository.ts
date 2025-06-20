import type { Activity } from '../../../types/activity.type';
import { ActivityStatus, ActivityType } from '../../../types/activity.type';
import { getActivities } from '../activities/activities.repository';
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

  const villages = await getVillages({ countryCode, villageId });
  const villageIds = villages.map((village) => village.id);

  const activities = await getActivities({ phase, villageIds, classroomId });
  const activitiesByPhases = groupBy(activities, (activity: Activity) => activity.phase);

  return Promise.all(
    villages.map(async (village) => {
      const phaseDetails: any[] = [];

      for (const [phaseId, activitiesByPhase] of activitiesByPhases) {
        if (phaseId === phase) return;

        const filteredActivities = activitiesByPhase.filter((activity: Activity) => activity.villageId === village.id && activity.phase === phaseId);

        const activityCounts = await getActivityCounts(filteredActivities, phaseId);
        phaseDetails.push(activityCounts);
      }

      return {
        villageName: village.name,
        phaseDetails,
      };
    }),
  );
};

const getActivityCounts = async (activities: Activity[], phaseId: number) => {
  const draftCount = activities.filter((activity: Activity) => activity.status === ActivityStatus.DRAFT).length;
  const videoCount = activities.reduce(
    (count, activity) => count + (Array.isArray(activity.content) ? activity.content.filter((content) => content.type === 'video').length : 0),
    0,
  );
  const commentCount = await getCommentCountForActivities(activities.map((activity) => activity.id));

  const baseActivityCount = { phaseId, draftCount, videoCount, commentCount };

  const activityCountByType = (type: number) => activities.filter((activity: Activity) => activity.type === type).length;

  if (phaseId === 1) {
    return {
      ...baseActivityCount,
      mascotCount: activityCountByType(ActivityType.MASCOTTE),
    };
  } else if (phaseId === 2) {
    return {
      ...baseActivityCount,
      reportingCount: activityCountByType(ActivityType.REPORTAGE),
      challengeCount: activityCountByType(ActivityType.DEFI),
      enigmaCount: activityCountByType(ActivityType.ENIGME),
      gameCount: activityCountByType(ActivityType.GAME),
      questionCount: activityCountByType(ActivityType.QUESTION),
      reactionCount: activityCountByType(ActivityType.REACTION),
      storyCount: activityCountByType(ActivityType.STORY),
    };
  } else if (phaseId === 3) {
    return {
      ...baseActivityCount,
      reinventStoryCount: activityCountByType(ActivityType.RE_INVENT_STORY),
      anthemCount: activityCountByType(ActivityType.ANTHEM),
    };
  }
};
