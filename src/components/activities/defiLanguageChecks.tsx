import type { LanguageDefiData } from 'src/activity-types/defi.types';

export const isFirstStepValid = (data: LanguageDefiData): boolean => {
  if (data?.languageCode.length === 0) return false;
  if (data?.languageIndex === -1) return false;
  return true;
};

export const isSecondStepValid = (data: LanguageDefiData): boolean => {
  if (data?.objectIndex === -1) return false;
  if (data?.explanationContentIndex === 0) return false;
  return true;
};

export const isFouthStepValid = (data: LanguageDefiData): boolean => {
  if (data?.defiIndex === null) return false;
  return true;
};

export const getErrorSteps = (data: LanguageDefiData, step: number) => {
  const errorSteps = [];

  if (step > 0 && !isFirstStepValid(data)) errorSteps.push(0);
  if (step > 1 && !isSecondStepValid(data)) errorSteps.push(1);
  if (step > 2 && !isFouthStepValid(data)) errorSteps.push(3);

  return errorSteps;
};
