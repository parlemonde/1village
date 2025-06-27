import type { VillageStats } from '../../../types/statistics.type';

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
