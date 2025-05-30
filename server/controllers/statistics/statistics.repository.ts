import type { Activity } from '../../../types/activity.type';
import { ActivityStatus, ActivityType } from '../../../types/activity.type';
import type { DayData, MonthData, StatsFilterParams } from '../../../types/statistics.type';
import { GroupType } from '../../../types/statistics.type';
import { AnalyticPerformance } from '../../entities/analytic';
import { UserType } from '../../entities/user';
import { AppDataSource } from '../../utils/data-source';
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
  const videoCount = activities.reduce((count, activity) => count + activity.content.filter((content) => content.type === 'video').length, 0);
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

export const getCountConnectionsByDayAndMonth = async (filters?: StatsFilterParams) => {
  const analyticPerformanceRepository = AppDataSource.getRepository(AnalyticPerformance);
  const query = analyticPerformanceRepository
    .createQueryBuilder('ap')
    .groupBy('YEAR(ap.date), MONTH(ap.date), DAY(ap.date)')
    .select('COUNT(*) as count, YEAR(ap.date) as year, MONTH(ap.date) as month, DAY(ap.date) as day');

  if (filters && filters.groupType === GroupType.FAMILY) {
    query
      .innerJoin('analytic_session', 'as', 'ap.sessionId = as.id')
      .innerJoin('user', 'user', 'as.userId = user.id')
      .where('user.type = :userType', { userType: UserType.FAMILY });
  }

  const data = (await query.getRawMany()) as { count: number; year: number; month: number; day: number }[];

  // Étape 1 : Regrouper les données par mois et jour
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

  // Étape 2 : Compléter les jours manquants dans chaque mois
  const result: MonthData[] = Object.keys(groupedData).map((monthYear) => {
    const date = new Date(monthYear);
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const barChartData: DayData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const value = groupedData[monthYear][day] || 0; // Utilise 0 si aucune donnée pour ce jour
      barChartData.push({
        value,
        isSelected: value > 0, // Exemple : sélectionner si ce jour a au moins une occurrence
      });
    }

    return {
      month: date.toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      }),
      barChartData,
    };
  });

  return result;
};
