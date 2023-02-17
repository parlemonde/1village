import type { LanguageDefiData } from 'src/activity-types/defi.types';

export const isFirstStepValid = (data: LanguageDefiData): boolean => {
  if (data.languageCode.length === 0) return false;
  if (data.languageIndex === 0) return false;
  return true;
};

export const isSecondStepValid = (data: LanguageDefiData): boolean => {
  if (data.themeName.length === 0 && data.hasSelectedThemeNameOther) return false;
  if (data.themeIndex === null && !data.hasSelectedThemeNameOther) return false;
  return true;
};
export const isFourthStepValid = (data: LanguageDefiData): boolean => {
  if (data.defi && data.defi.length === 0) return false;
  if (data.defiIndex === null && data.hasSelectedDefiNameOther === false) return false;
  return true;
};

export const getErrorSteps = (data: LanguageDefiData, step: number) => {
  const errorSteps = [];

  if (step > 0 && !isFirstStepValid(data)) errorSteps.push(0);
  if (step > 1 && !isSecondStepValid(data)) errorSteps.push(1);
  if (step > 3 && !isFourthStepValid(data)) errorSteps.push(3);
  return errorSteps;
};
