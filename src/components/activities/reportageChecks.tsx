import type { ReportageData } from 'src/activity-types/reportage.types';

export const isFirstStepValid = (data: ReportageData): boolean => {
  if (data?.reportage === '' || data?.reportage === undefined) return false;
  return true;
};

export const getErrorSteps = (data: ReportageData, step: number) => {
  const errorSteps = [];
  if (step > 0 && !isFirstStepValid(data)) errorSteps.push(0);
  return errorSteps;
};
