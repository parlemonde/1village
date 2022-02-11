import type { EcoDefiData } from 'src/activity-types/defi.types';

export const isFirstStepValid = (data: EcoDefiData): boolean => {
  if (data?.type === null) return false;
  return true;
};

export const isThirdStepValid = (data: EcoDefiData): boolean => {
  if (data?.defiIndex === null) return false;
  return true;
};

export const getErrorSteps = (data: EcoDefiData, step: number) => {
  const errorSteps = [];

  if (step > 0 && !isFirstStepValid(data)) errorSteps.push(0);
  if (step > 1 && !isThirdStepValid(data)) errorSteps.push(2);

  return errorSteps;
};
