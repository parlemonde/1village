import type { MascotteData } from 'src/activity-types/presentation.types';

export const isSecondStepValid = (data: MascotteData): boolean => {
  if (data?.mascotteName === '') return false;
  if (data?.mascotteDescription === '') return false;
  if (data?.personality1 === '') return false;
  if (data?.personality2 === '') return false;
  if (data?.personality3 === '') return false;
  if (data?.countries === []) return false;
  if (data?.game === '') return false;
  if (data?.sport === '') return false;
  return true;
};

export const isFirstStepValid = (data: MascotteData) => {
  const isValidSum = (x: number, y: number, z: number) => {
    if (x < 0 || y < 0) return false;
    return x + y === z;
  };

  return (
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
    data?.meanAge !== null
  );
};

export const getErrorSteps = (data: MascotteData) => {
  const errorSteps = [];

  if (!isFirstStepValid(data)) errorSteps.push(0);
  if (!isSecondStepValid(data)) errorSteps.push(1);

  return errorSteps;
};
