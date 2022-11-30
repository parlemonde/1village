import type { FreeDefiData } from 'src/activity-types/defi.types';

export const isFirstStepValid = (data: FreeDefiData): boolean => {
  if (data.themeName.length === 0) return false;
  return true;
};

export const isSecondStepValid = (data: FreeDefiData): boolean => {
  // if (data?.defiIndex === null) return false;
  return true;
};
export const isThirdStepValid = (data: FreeDefiData): boolean => {
  // if (data?.defiIndex === null) return false;
  return true;
};

export const getErrorSteps = (data: FreeDefiData, step: number) => {
  const errorSteps = [];

  if (step > 0 && !isFirstStepValid(data)) errorSteps.push(0);
  if (step > 1 && !isSecondStepValid(data)) errorSteps.push(1);

  return errorSteps;
};
