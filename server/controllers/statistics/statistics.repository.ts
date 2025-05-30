import moment from 'moment';

import type { Activity } from '../../../types/activity.type';
import { ActivityType } from '../../../types/activity.type';
import type { DayData, MonthData, StatsFilterParams } from '../../../types/statistics.type';
import { GroupType } from '../../../types/statistics.type';
import { AnalyticPerformance } from '../../entities/analytic';
import { UserType } from '../../entities/user';
import { AppDataSource } from '../../utils/data-source';
import { getActivities } from '../activities/activities.repository';
import { getVillages } from '../villages/village.repository';

/*type ExchangeParams = {
  countryCode: string;
  phaseId: number;
  villageId?: number;
  classRoomId?: number;
};*/

// groupBy function only available for Node.js v21
function groupBy(list: any, keyGetter: any) {
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
}

export const getActivityTypeCountByVillages = async () => {
  const villages = await getVillages();
  const activities = await getActivities();

  const activitiesByPhases = groupBy(activities, (activity: Activity) => activity.phase);

  return villages.map((village) => {
    const phaseDetails: any[] = [];

    activitiesByPhases.forEach((activities: Activity[], phaseId: number) => {
      const filteredActivities = activities.filter((activity: Activity) => activity.villageId === village.id && activity.phase === phaseId);

      phaseDetails.push(getActivitiesCount(filteredActivities, phaseId));
    });

    return {
      villageName: village.name,
      phaseDetails,
    };
  });
};

const getActivitiesCount = (activities: Activity[], phaseId: number) => {
  if (phaseId === 1) {
    return {
      phaseId,
      mascotCount: activities.filter((activity: Activity) => activity.type === ActivityType.MASCOTTE).length,
      videoCount: 100,
      draftCount: 100,
      commentCount: 100,
    };
  } else if (phaseId === 2) {
    return {
      phaseId,
      videoCount: 100,
      draftCount: 100,
      commentCount: 100,
      reportingCount: activities.filter((activity: Activity) => activity.type === ActivityType.REPORTAGE).length,
      challengeCount: activities.filter((activity: Activity) => activity.type === ActivityType.DEFI).length,
      enigmaCount: activities.filter((activity: Activity) => activity.type === ActivityType.ENIGME).length,
      gameCount: activities.filter((activity: Activity) => activity.type === ActivityType.GAME).length,
      questionCount: activities.filter((activity: Activity) => activity.type === ActivityType.QUESTION).length,
      reactionCount: activities.filter((activity: Activity) => activity.type === ActivityType.REACTION).length,
      storyCount: activities.filter((activity: Activity) => activity.type === ActivityType.STORY).length,
    };
  } else if (phaseId === 3) {
    return {
      phaseId,
      videoCount: 100,
      draftCount: 100,
      reinventStoryCount: activities.filter((activity: Activity) => activity.type === ActivityType.RE_INVENT_STORY).length,
      anthemCount: activities.filter((activity: Activity) => activity.type === ActivityType.ANTHEM).length,
      commentCount: 100,
    };
  }
};

/*export const getExchanges = async (params?: ExchangeParams) => {
  const { countryCode } = params || {};

  const videoRepository = AppDataSource.getRepository(Video);
  const commentRepository = AppDataSource.getRepository(Comment);

  const videoQB = videoRepository.createQueryBuilder('video').innerJoin('video.user', 'user');

  const commentQB = commentRepository.createQueryBuilder('comment').innerJoin('comment.user', 'user');

  if (countryCode) {
    videoQB.where('user.countryCode = :countryCode', { countryCode });
    commentQB.where('user.countryCode = :countryCode', { countryCode });
  }

  const [videosCount, commentsCount] = await Promise.all([videoQB.getCount(), commentQB.getCount()]);

  return {
    videosCount,
    publicationsCount: 100,
    commentsCount,
  };
};*/

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
