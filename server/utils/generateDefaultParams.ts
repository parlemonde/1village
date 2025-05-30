import type { StatsFilterParams } from '../../types/statistics.type';

export const generateDefaultStatsFilterParams = (): StatsFilterParams => {
  return {
    villageId: undefined,
    classroomId: undefined,
    countryId: undefined,
    phase: undefined,
    groupType: undefined,
  };
};
