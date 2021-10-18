import type { MascotteData } from 'src/activity-types/presentation.types';

export const isValidSum = (x: number, y: number, z: number) => {
  if (x < 0 || y < 0) return false;
  return x + y === z;
};

export const isFirstStepValid = (data: MascotteData) =>
  data?.presentation.length > 0 &&
  isValidSum(data?.girlStudent, data?.boyStudent, data?.totalStudent) &&
  isValidSum(data?.womanTeacher, data?.manTeacher, data?.totalTeacher) &&
  data?.totalStudent !== 0 &&
  data?.totalTeacher !== 0 &&
  data?.totalStudent !== null &&
  data?.totalTeacher !== null &&
  data?.numberClassroom !== 0 &&
  data?.numberClassroom !== null &&
  data?.totalSchoolStudent !== 0 &&
  data?.totalSchoolStudent !== null &&
  data?.meanAge !== 0 &&
  data?.meanAge !== null &&
  data?.classImg !== '' &&
  data?.classImgDesc !== '';

export const isSecondStepValid = (data: MascotteData): boolean => {
  if (data?.mascotteName === '') return false;
  if (data?.mascotteImage === '') return false;
  if (data?.mascotteDescription === '') return false;
  if (data?.personality1 === '') return false;
  if (data?.personality2 === '') return false;
  if (data?.personality3 === '') return false;
  if (data?.countries === []) return false;
  if (data?.game === '') return false;
  if (data?.sport === '') return false;
  return true;
};

export const isThirdStepValid = (data: MascotteData): boolean => {
  if (data?.fluentLanguages?.length === 0) return false;
  if (data?.minorLanguages?.length === 0) return false;
  if (data?.wantedForeignLanguages?.length === 0) return false;
  if (data?.currencies?.length === 0) return false;
  return true;
};

export const getErrorSteps = (data: MascotteData, step: number) => {
  const errorSteps = [];

  if (step > 0 && !isFirstStepValid(data)) errorSteps.push(0);
  if (step > 1 && !isSecondStepValid(data)) errorSteps.push(1);
  if (step > 2 && !isThirdStepValid(data)) errorSteps.push(2);

  return errorSteps;
};

export const stepsHasBeenFilled = (data: MascotteData, step: number) => {
  if (step === 0) {
    return (
      data?.mascotteName !== '' ||
      data?.mascotteImage !== '' ||
      data?.mascotteDescription !== '' ||
      data?.personality1 !== '' ||
      data?.personality2 !== '' ||
      data?.personality3 !== '' ||
      data?.countries?.length > 0 ||
      data?.game !== '' ||
      data?.sport !== '' ||
      data?.fluentLanguages?.length > 0 ||
      data?.minorLanguages?.length > 0 ||
      data?.wantedForeignLanguages?.length > 0 ||
      data?.currencies?.length > 0
    );
  }
    return (
      data?.fluentLanguages?.length > 0 ||
      data?.minorLanguages?.length > 0 ||
      data?.wantedForeignLanguages?.length > 0 ||
      data?.currencies?.length > 0
    );
};
