import { ActivityStatus } from '../../../types/activity.type';
import type { Activity } from '../../entities/activity';
import type { Classroom } from '../../entities/classroom';
import { AppDataSource } from '../../utils/data-source';
import { getActivities } from '../activities/activities.repository';
import { getClassrooms } from '../classrooms/classroom.repository';
import { getCommentCountForActivities } from '../comments/comments.repository';
import { getVillages } from '../villages/village.repository';

// DEPRECATED: groupBy function only available for Node.js v21
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

export const getActivityTypeCountByVillages = async (params?: GetActivityTypeCountByVillagesParams) => {
  const { phase, villageId, classroomId, format = 'compare' } = params || {};

  // On récupère d'abord les villages concernés
  // Pour l'endpoint countries, on veut TOUS les pays, pas seulement le pays sélectionné
  let classrooms: Classroom[];
  if (classroomId) {
    // Pour l'endpoint classes, on veut toutes les classes du village de la classe spécifiée
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

  // On récupère toutes les activités de ces villages
  const activities = await getActivities({ phase, villageIds });

  // On groupe les activités par phase
  const activitiesByPhase = groupBy(activities, (activity: Activity) => activity.phase);

  const result = [];

  for (const village of villages) {
    // On groupe les classes par pays
    const filteredClassrooms = classrooms.filter((classroom: Classroom) => classroom.villageId === village.id);
    const classroomsByCountry = groupBy(filteredClassrooms, (classroom: Classroom) => classroom.countryCode);

    const classroomDetails: unknown[] = [];

    // Pour chaque pays du village
    for (const [countryCode, countryClassrooms] of classroomsByCountry) {
      const phaseDetails: unknown[] = [];

      // Pour chaque phase
      for (const [phaseId, phaseActivities] of activitiesByPhase) {
        if (Number(phaseId) === Number(phase) || phase === undefined) {
          // On filtre les activités par pays de l'utilisateur qui les a créées
          const filteredActivities = phaseActivities.filter((activity: Activity) => {
            // Utiliser directement la relation user de l'activité
            const userCountryCode = (activity as unknown as { user?: { countryCode: string } }).user?.countryCode;
            return userCountryCode === countryCode && activity.phase === phaseId;
          });

          const activityCounts = await getActivityCounts(filteredActivities, phaseId);
          phaseDetails.push(activityCounts);
        }
      }

      // Pour l'endpoint classes, on veut toutes les classes du village
      if (classroomId) {
        // Retourner toutes les classes du village, pas seulement la classe spécifiée
        for (const classroom of countryClassrooms as Classroom[]) {
          // Utiliser le displayName de l'utilisateur au lieu du nom de la classe
          const classroomName = classroom.user?.displayName || classroom.name || `Classe ${classroom.id}`;

          if (format === 'dashboard') {
            // Format pour dashboard
            const totalPublications = phaseDetails.reduce((total: number, phase: unknown) => {
              const phaseTyped = phase as {
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
              };
              return (
                total +
                (phaseTyped.mascotCount || 0) +
                (phaseTyped.videoCount || 0) +
                (phaseTyped.challengeCount || 0) +
                (phaseTyped.enigmaCount || 0) +
                (phaseTyped.gameCount || 0) +
                (phaseTyped.questionCount || 0) +
                (phaseTyped.reportingCount || 0) +
                (phaseTyped.storyCount || 0) +
                (phaseTyped.anthemCount || 0) +
                (phaseTyped.reinventStoryCount || 0) +
                (phaseTyped.contentLibreCount || 0)
              );
            }, 0);

            classroomDetails.push({
              name: classroomName,
              classroomId: classroom.id.toString(),
              totalPublications,
              classroomName,
              countryCode,
              phaseDetails,
            });
          } else {
            // Format pour compare
            classroomDetails.push({
              phaseDetails,
              classroomName,
              classroomId: classroom.id,
              countryCode,
            });
          }
        }
      } else {
        // Une seule entrée par pays pour les autres endpoints
        if (format === 'dashboard') {
          // Format pour dashboard
          const totalPublications = phaseDetails.reduce((total: number, phase: unknown) => {
            const phaseTyped = phase as {
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
            };
            return (
              total +
              (phaseTyped.mascotCount || 0) +
              (phaseTyped.videoCount || 0) +
              (phaseTyped.challengeCount || 0) +
              (phaseTyped.enigmaCount || 0) +
              (phaseTyped.gameCount || 0) +
              (phaseTyped.questionCount || 0) +
              (phaseTyped.reportingCount || 0) +
              (phaseTyped.storyCount || 0) +
              (phaseTyped.anthemCount || 0) +
              (phaseTyped.reinventStoryCount || 0) +
              (phaseTyped.contentLibreCount || 0)
            );
          }, 0);

          classroomDetails.push({
            name: `${countryCode} Classes`,
            classroomId: null,
            totalPublications,
            classroomName: `${countryCode} Classes`,
            countryCode,
            phaseDetails,
          });
        } else {
          // Format pour compare
          classroomDetails.push({
            phaseDetails,
            classroomName: `${countryCode} Classes`,
            classroomId: null,
            countryCode,
          });
        }
      }
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
    // Phase 1 - Utiliser les types qui existent réellement dans la base
    const mascotCount = activityByType.get(8)?.length || 0; // Type 8 = MASCOTTE
    const indiceCount = activityByType.get(6)?.length || 0; // Type 6 = INDICE (n'existe pas dans la base récente)

    // Utiliser les types qui existent réellement
    const enigmaCount = activityByType.get(1)?.length || 0; // Type 1 = ENIGME
    const challengeCount = activityByType.get(2)?.length || 0; // Type 2 = DEFI
    const questionCount = activityByType.get(3)?.length || 0; // Type 3 = QUESTION
    const gameCount = activityByType.get(4)?.length || 0; // Type 4 = GAME
    const contentLibreCount = activityByType.get(5)?.length || 0; // Type 5 = CONTENU_LIBRE

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
    // Phase 2
    const reportingCount = activityByType.get(9)?.length || 0; // Type 9 = REPORTAGE
    const challengeCount = activityByType.get(2)?.length || 0; // Type 2 = DEFI
    const enigmaCount = activityByType.get(1)?.length || 0; // Type 1 = ENIGME
    const gameCount = activityByType.get(4)?.length || 0; // Type 4 = GAME
    const questionCount = activityByType.get(3)?.length || 0; // Type 3 = QUESTION
    const reactionCount = activityByType.get(10)?.length || 0; // Type 10 = REACTION
    const storyCount = activityByType.get(13)?.length || 0; // Type 13 = STORY

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
    // Phase 3
    const reinventStoryCount = activityByType.get(14)?.length || 0; // Type 14 = RE_INVENT_STORY (n'existe pas dans la base récente)
    const anthemCount = (activityByType.get(11)?.length || 0) + (activityByType.get(12)?.length || 0); // Type 11 = ANTHEM, Type 12 = CLASS_ANTHEM

    return {
      ...baseActivityCount,
      reinventStoryCount,
      anthemCount,
    };
  } else {
    return { ...baseActivityCount };
  }
};
