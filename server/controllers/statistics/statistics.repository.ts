import { ActivityStatus } from '../../../types/activity.type';
import type { ClassroomCountDetails, CountryCountDetails, PhaseDetails, VillageCountDetails } from '../../../types/statistics.type';
import type { Activity } from '../../entities/activity';
import type { Classroom } from '../../entities/classroom';
import type { Village } from '../../entities/village';
import { getCountryCodes } from '../../repositories/country.repository';
import {
  getVideosCountByClassroomUserByUserId,
  getVideosCountByCountryCode,
  getVideosCountByVillageCountryAndPhase,
  getVideosCountByVillageId,
  getVideosTotalCount,
} from '../../repositories/video.repository';
import {
  getActivitiesByClassroomUserAndPhase,
  getActivitiesByCountryAndPhase,
  getActivitiesByVillageCountryAndPhase,
  getActivitiesByVillageIdAndPhase,
  getActivitiesCountByStatusAndCountry,
  getActivitiesTotalCount,
  getActivitiesCountByStatusAndVillageId,
  getDraftActivitiesCountByVillageCountryAndPhase,
  getActivitiesCountByStatusAndClassroomUser,
} from '../activities/activities.repository';
import { getClassroomById, getClassrooms } from '../classrooms/classroom.repository';
import {
  getCommentsCountByCountry,
  getCommentsCountByVillageCountryAndPhase,
  getCommentsCountByVillageId,
  getCommentsTotalCount,
  getUserCommentsCountByUserId,
} from '../comments/comments.repository';
import type { VillageWithNameAndId } from '../villages/village.repository';
import { getAllVillagesNames, getVillageById } from '../villages/village.repository';
import type { TotalActivitiesCounts } from './statistics.dto';

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

const createClassroomEntry = (classroom: Classroom, phaseDetails: PhaseDetails): ClassroomCountDetails => {
  const classroomEntry: ClassroomCountDetails = {
    id: classroom.id,
    name: getClassroomDisplayName(classroom),
    phaseDetails,
  };

  return classroomEntry;
};

function getClassroomDisplayName(classroom: Classroom): string {
  const classroomUser = classroom.user;
  const nameWithUserLevelAndCity =
    classroomUser.level && classroomUser.city ? `La classe de ${classroomUser.level} à ${classroomUser.city}` : undefined;
  const nameWithUserCity = classroomUser.city ? `La classe de ${classroomUser.city}` : undefined;

  return classroom.name ?? classroomUser.displayName ?? nameWithUserLevelAndCity ?? nameWithUserCity ?? `Classe n°${classroom.id}`;
}

const getActivityCounts = async (activities: Activity[], phaseId: number) => {
  const activityByType = groupBy(activities, (activity: Activity) => activity.type);

  // Se référer à l'enum ActivityType dans types/activity.type.ts pour les types d'activités
  switch (phaseId) {
    case 1:
      return {
        phaseId,
        indiceCount: activityByType.get(6)?.length || 0,
        mascotCount: activityByType.get(8)?.length || 0,
        enigmaCount: activityByType.get(1)?.length || 0,
        challengeCount: activityByType.get(2)?.length || 0, // Challenge = Defi
        questionCount: activityByType.get(3)?.length || 0,
        gameCount: activityByType.get(4)?.length || 0,
      };
    case 2:
      return {
        phaseId,
        reportingCount: activityByType.get(9)?.length || 0,
        challengeCount: activityByType.get(2)?.length || 0, // Challenge = Defi
        enigmaCount: activityByType.get(1)?.length || 0,
        gameCount: activityByType.get(4)?.length || 0,
        questionCount: activityByType.get(3)?.length || 0,
        reactionCount: activityByType.get(10)?.length || 0,
      };
    case 3:
      return {
        phaseId,
        reinventStoryCount: activityByType.get(14)?.length || 0,
        anthemCount: activityByType.get(12)?.length || 0,
        contentLibreCount: activityByType.get(5)?.length || 0,
        storyCount: activityByType.get(13)?.length || 0,
      };
    default:
      return { phaseId };
  }
};

export async function getTotalActivitiesCountsByClassroomId(classroomId: number, phase?: number): Promise<TotalActivitiesCounts> {
  const classroom: Classroom | null = await getClassroomById(classroomId);

  if (!classroom) {
    throw new Error(`Classroom with id ${classroomId} not found`);
  }

  const totalPublications = await getActivitiesCountByStatusAndClassroomUser(ActivityStatus.PUBLISHED, classroom.user.id, phase);
  const totalComments = await getUserCommentsCountByUserId(classroom.user.id, phase);
  const totalVideos = await getVideosCountByClassroomUserByUserId(classroom.user.id, phase);

  return { totalPublications, totalComments, totalVideos };
}

export async function getTotalActivitiesCountsByVillageId(villageId: number, phase?: number): Promise<TotalActivitiesCounts> {
  const village: Village | null = await getVillageById(villageId);

  if (!village) {
    throw new Error(`Village with id ${villageId} not found`);
  }

  const totalPublications = await getActivitiesCountByStatusAndVillageId(ActivityStatus.PUBLISHED, village.id, phase);
  const totalComments = await getCommentsCountByVillageId(village.id, phase);
  const totalVideos = await getVideosCountByVillageId(village.id, phase);

  return { totalPublications, totalComments, totalVideos };
}

export async function getTotalActivitiesCountsByCountryCode(countryCode: string, phase?: number): Promise<TotalActivitiesCounts> {
  const totalPublications = await getActivitiesCountByStatusAndCountry(ActivityStatus.PUBLISHED, countryCode, phase);
  const totalComments = await getCommentsCountByCountry(countryCode, phase);
  const totalVideos = await getVideosCountByCountryCode(countryCode, phase);

  return { totalPublications, totalComments, totalVideos };
}

export async function getTotalActivitiesCounts(phase?: number): Promise<TotalActivitiesCounts> {
  const totalPublications = await getActivitiesTotalCount(phase);
  const totalComments = await getCommentsTotalCount(phase);
  const totalVideos = await getVideosTotalCount(phase);

  return { totalPublications, totalComments, totalVideos };
}

export async function getDetailedActivitiesCountsByVillages(phase: number) {
  const allVillages: VillageWithNameAndId[] = await getAllVillagesNames();

  return await formatVillagesActivitiesByPhase(phase, allVillages);
}

async function formatVillagesActivitiesByPhase(phase: number, villages: VillageWithNameAndId[]): Promise<VillageCountDetails[]> {
  const villageDetails: VillageCountDetails[] = [];

  for (const village of villages) {
    const publishedActivities = await getActivitiesByVillageIdAndPhase(village.id, phase);
    const phaseDetails: PhaseDetails = {
      ...(await getActivityCounts(publishedActivities, phase)),
      draftCount: await getActivitiesCountByStatusAndVillageId(ActivityStatus.DRAFT, village.id, phase),
      commentCount: await getCommentsCountByVillageId(village.id, phase),
      videoCount: await getVideosCountByVillageId(village.id, phase),
    };

    const villageEntry = { ...village, phaseDetails };
    villageDetails.push(villageEntry);
  }

  return villageDetails;
}

export async function getDetailedActivitiesCountsByCountries(phase: number) {
  const allVillagesCountryCodes = (await getCountryCodes()).map((countryObject) => countryObject.countryCode);

  return await formatCountriesActivitiesByPhase(phase, allVillagesCountryCodes);
}

async function formatCountriesActivitiesByPhase(phase: number, countryCodes: string[]): Promise<CountryCountDetails[]> {
  const countriesDetails: CountryCountDetails[] = [];

  for (const countryCode of countryCodes) {
    const publishedActivities = await getActivitiesByCountryAndPhase(countryCode, phase);
    const phaseDetails: PhaseDetails = {
      ...(await getActivityCounts(publishedActivities, phase)),
      draftCount: await getActivitiesCountByStatusAndCountry(ActivityStatus.DRAFT, countryCode, phase),
      commentCount: await getCommentsCountByCountry(countryCode, phase),
      videoCount: await getVideosCountByCountryCode(countryCode, phase),
    };

    countriesDetails.push({ countryCode, phaseDetails });
  }

  return countriesDetails;
}

export async function getDetailedActivitiesCountsByVillage(villageId: number, phase: number) {
  const village: Village | null = await getVillageById(villageId);
  if (!village) {
    throw new Error(`Village with id ${villageId} not found`);
  }

  const villageCountryCodes = village.countryCodes;

  return await formatVillageActivitiesByPhase(villageId, phase, villageCountryCodes);
}

async function formatVillageActivitiesByPhase(villageId: number, phase: number, countryCodes: string[]): Promise<CountryCountDetails[]> {
  const countriesDetails: CountryCountDetails[] = [];

  for (const countryCode of countryCodes) {
    const publishedActivities = await getActivitiesByVillageCountryAndPhase(villageId, countryCode, phase);
    const phaseDetails: PhaseDetails = {
      ...(await getActivityCounts(publishedActivities, phase)),
      draftCount: await getDraftActivitiesCountByVillageCountryAndPhase(villageId, countryCode, phase),
      commentCount: await getCommentsCountByVillageCountryAndPhase(villageId, countryCode, phase),
      videoCount: await getVideosCountByVillageCountryAndPhase(villageId, countryCode, phase),
    };

    countriesDetails.push({ countryCode, phaseDetails });
  }

  return countriesDetails;
}

export async function getDetailedActivitiesCountsByClassrooms(villageId: number, phase: number) {
  const village: Village | null = await getVillageById(villageId);
  if (!village) {
    throw new Error(`Village with id ${villageId} not found`);
  }

  const classroomsOfTheSameVillage: Classroom[] = await getClassrooms({ villageId });

  return await formatClassroomsActivitiesByPhase(phase, classroomsOfTheSameVillage);
}

async function formatClassroomsActivitiesByPhase(phase: number, classrooms: Classroom[]): Promise<ClassroomCountDetails[]> {
  const classroomDetails: ClassroomCountDetails[] = [];

  for (const classroom of classrooms) {
    const activities = await getActivitiesByClassroomUserAndPhase(classroom.user.id, phase);

    const publishedActivities: PhaseDetails = {
      ...(await getActivityCounts(activities, phase)),
      draftCount: await getActivitiesCountByStatusAndClassroomUser(ActivityStatus.DRAFT, classroom.user.id, phase),
      commentCount: await getUserCommentsCountByUserId(classroom.user.id, phase),
      videoCount: await getVideosCountByClassroomUserByUserId(classroom.user.id, phase),
    };

    const classroomEntry = createClassroomEntry(classroom, publishedActivities);
    classroomDetails.push(classroomEntry);
  }

  return classroomDetails;
}
