import type { StatsFilterParams } from '../../../types/statistics.type';

export const generateEmptyFilterParams = (): StatsFilterParams => {
  const filterParams: { [K in keyof StatsFilterParams]: StatsFilterParams[K] } = {
    villageId: undefined,
    classroomId: undefined,
    countryId: undefined,
    phase: undefined,
  };

  return filterParams;
};
