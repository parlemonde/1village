import { ActivityStatus, ActivityType } from '../../../types/activity.type';
import type { DailyCount, DailyCountByMonth, StatsFilterParams } from '../../../types/statistics.type';
import { GroupType } from '../../../types/statistics.type';
import type { Activity } from '../../entities/activity';
import { AnalyticSession } from '../../entities/analytic';
import { UserType } from '../../entities/user';
import { AppDataSource } from '../../utils/data-source';
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
  const villageIds = [...new Set(classrooms.map((classroom) => classroom.villageId))];
  const villages = await getVillages({ villageIds });
  const activities = await getActivities({ phase, villageIds });

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

export const getDailyConnectionCountByMonth = async (filters?: StatsFilterParams) => {
  const query = AppDataSource.getRepository(AnalyticSession)
    .createQueryBuilder('as')
    .select('COUNT(*) as count, YEAR(as.date) as year, MONTH(as.date) as month, DAY(as.date) as day, DATE(as.date) as date')
    .groupBy('YEAR(as.date), MONTH(as.date), DAY(as.date), DATE(as.date)')
    .orderBy('DATE(as.date)', 'ASC');

  if (filters && filters.groupType === GroupType.FAMILY) {
    query.innerJoin('user', 'user', 'as.userId = user.id').where('user.type = :userType', { userType: UserType.FAMILY });
  }

  const data = (await query.getRawMany()) as { count: number; year: number; month: number; day: number; date: string }[];

  // Step 1: Group data by month and day
  const groupedData = data.reduce((acc, item) => {
    // To change to base Date
    const date = new Date(item.year, item.month - 1);
    const monthYear = date.toLocaleDateString('en-EN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (!acc[monthYear]) {
      acc[monthYear] = {};
    }
    acc[monthYear][item.day] = item.count;

    return acc;
  }, {} as Record<string, Record<number, number>>);

  // Step 2: Fill in missing days for each month
  const result: DailyCountByMonth[] = Object.keys(groupedData).map((monthYear) => {
    const date = new Date(monthYear);
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const counts: DailyCount[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const value = groupedData[monthYear][day] || 0; // Utilise 0 si aucune donnée pour ce jour
      counts.push({
        value,
        selected: value > 0, // Exemple : sélectionner si ce jour a au moins une occurrence
      });
    }

    return {
      month: date.toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      }),
      counts,
    };
  });

  return result;
};
