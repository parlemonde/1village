import type { ClassroomToMonitor, OneVillageTableRow, VillageStats } from '../../../types/statistics.type';
import { ClassroomMonitoringStatus } from '../../../types/statistics.type';
import { getUserDisplayName } from 'src/utils';

export const getVideoCount = (data?: VillageStats) => {
  if (!data?.activityCountDetails?.length) return 0;

  return data.activityCountDetails.reduce((total, detail) => {
    const classroomVideos = detail.classrooms.reduce((sumClass, classroom) => {
      const phaseVideos = classroom.phaseDetails.reduce((sumPhase, phase) => {
        return sumPhase + phase.videoCount;
      }, 0);
      return sumClass + phaseVideos;
    }, 0);
    return total + classroomVideos;
  }, 0);
};

export const getCommentCount = (data?: VillageStats) => {
  if (!data?.activityCountDetails?.length) return 0;

  return data.activityCountDetails.reduce((total, detail) => {
    const classroomComments = detail.classrooms.reduce((sumClass, classroom) => {
      const phaseComments = classroom.phaseDetails.reduce((sumPhase, phase) => {
        return sumPhase + phase.commentCount;
      }, 0);
      return sumClass + phaseComments;
    }, 0);
    return total + classroomComments;
  }, 0);
};

export const getPublicationCount = (data?: VillageStats) => {
  if (!data?.activityCountDetails?.length) return 0;

  return data.activityCountDetails
    .flatMap((detail) => detail.classrooms ?? [])
    .flatMap((c) => c.phaseDetails ?? [])
    .reduce((total, phase) => {
      Object.entries(phase).forEach(([key, value]) => {
        if (key !== 'phaseId' && key !== 'draftCount' && typeof value === 'number') {
          total += value;
        }
      });
      return total;
    }, 0);
};

export const getStatusLabel = (status: ClassroomMonitoringStatus): string => {
  return (
    new Map<ClassroomMonitoringStatus, string>([
      [ClassroomMonitoringStatus.NO_CONNECTION_SINCE_FIRST, '1 seule connexion'],
      [ClassroomMonitoringStatus.AT_LEAST_THREE_DRAFTS_IN_PROGRESS, 'accumulation de brouillons '],
      [ClassroomMonitoringStatus.THREE_WEEK_WITHOUT_CONNECTION, 'Au moins 3 semaines sans connexion'],
    ]).get(status) ?? 'Statut inconnu'
  );
};

export const getClassroomsToMonitorRows = (data: ClassroomToMonitor[] | undefined): OneVillageTableRow[] => {
  if (!data || !Array.isArray(data)) return [];
  return data.map(
    (classroom) =>
      ({
        ...classroom,
        name: classroom.name ?? getUserDisplayName(classroom.user, false, true),
        status: getStatusLabel(classroom.status),
      } as unknown as OneVillageTableRow),
  );
};
