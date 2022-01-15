import type { EnigmeData } from 'src/activity-types/enigme.types';

export const isFirstStepValid = (data: EnigmeData): boolean => {
  if (data?.theme === null) return false;
  return true;
};

export const getErrorSteps = (data: EnigmeData, step: number) => {
  const errorSteps = [];

  if (step > 0 && !isFirstStepValid(data)) errorSteps.push(0);

  return errorSteps;
};
