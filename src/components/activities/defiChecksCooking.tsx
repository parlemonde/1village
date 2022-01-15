import type { CookingDefiData } from 'src/activity-types/defi.types';

export const isFirstStepValid = (data: CookingDefiData): boolean => {
  if (data?.name === '') return false;
  if (data?.history === '') return false;
  if (data?.explanation === '') return false;
  return true;
};

export const isThirdStepValid = (data: CookingDefiData): boolean => {
  if (data?.defiIndex === null) return false;
  return true;
};

export const getErrorSteps = (data: CookingDefiData, step: number) => {
  const errorSteps = [];

  if (step > 0 && !isFirstStepValid(data)) errorSteps.push(0);
  if (step > 1 && !isThirdStepValid(data)) errorSteps.push(2);

  return errorSteps;
};
